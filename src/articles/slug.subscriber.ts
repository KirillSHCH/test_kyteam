import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { ArticleEntity } from './article.entity';
import slugify from 'slugify';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return ArticleEntity;
  }

  async beforeInsert(event: InsertEvent<ArticleEntity>) {
    if (event.metadata.findColumnWithDatabaseName('slug') && !event.entity.slug) {
      event.entity.slug = await this.createUniqueSlug(event, event.entity.title);
    }
  }

  async beforeUpdate(event: UpdateEvent<ArticleEntity>) {
    if (event.metadata.findColumnWithDatabaseName('slug') && event.entity) {
      const isSlugUpdated = Boolean(
        event.updatedColumns.find((item) => item.propertyName === 'slug'),
      );

      //  NOTE: Пустой slug при обновлении - сгенерировать новый slug
      if (isSlugUpdated && !event.entity.slug) {
        event.entity.slug = await this.createUniqueSlug(
          event,
          event.entity.title,
          event.entity?.id,
        );
      }
    }
  }

  private async createUniqueSlug(
    event: InsertEvent<any> | UpdateEvent<any>,
    name: string,
    id?: number | null,
  ) {
    const slug = slugify(name, {
      lower: true,
      replacement: '-',
      strict: true,
      locale: 'ru',
    });

    const params: { slug: string; id?: number } = { slug: `${slug}%` };

    const builder = event.connection
      .getRepository(event.metadata.target)
      .createQueryBuilder()
      .select('slug')
      .where('slug ilike :slug');

    // Исключаем самих себя
    if (id) {
      params.id = id;
      builder.andWhere('id!=:id');
    }

    const similarSlugs = await builder.setParameters(params).execute();

    if (!similarSlugs.length) {
      return slug;
    }

    return this.changeSlug(slug, similarSlugs);
  }

  private changeSlug(slug: string, similarSlugs: any[], last = 2) {
    if (similarSlugs.filter((item) => item.slug === slug).length) {
      let newSlug = `${slug}-${last}`;
      if (similarSlugs.filter((item) => item.slug === newSlug).length) {
        const next = last + 1;
        newSlug = this.changeSlug(slug, similarSlugs, next);
      }

      return newSlug;
    }

    return slug;
  }
}
