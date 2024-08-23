import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { ArticleEntity } from './article.entity';

@EventSubscriber()
export class PublishedSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return ArticleEntity;
  }

  async beforeInsert(event: InsertEvent<any>) {
    if (
      event.metadata.findColumnWithDatabaseName('publishedAt') &&
      Object.prototype.hasOwnProperty.call(event.entity, 'published') &&
      !Object.prototype.hasOwnProperty.call(event.entity, 'publishedAt')
    ) {
      if (event.entity.published) {
        event.entity.publishedAt = new Date();
      }
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    if (event.metadata.findColumnWithDatabaseName('publishedAt') && event.entity) {
      const isPublishedUpdated = Boolean(
        event.updatedColumns.find((item) => item.propertyName === 'published'),
      );
      const isPublishedAtUpdated = Boolean(
        event.updatedColumns.find((item) => item.propertyName === 'publishedAt'),
      );

      if (isPublishedUpdated && !isPublishedAtUpdated) {
        event.entity.publishedAt = event.entity.published ? new Date() : null;
      }
    }
  }
}
