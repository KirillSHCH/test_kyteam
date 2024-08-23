import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { ArticleEntity } from '../articles/article.entity';

export class CreateArticleTable1724353932964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ArticleEntity.sqlAlias,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'ID статьи',
          },
          {
            name: 'title',
            type: 'varchar',
            comment: 'Заголовок',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            comment: 'ЧПУ',
          },
          {
            name: 'description',
            type: 'text',
            comment: 'Описание',
          },
          {
            name: 'published',
            type: 'boolean',
            default: false,
            comment: 'Флаг опубликован',
          },
          {
            name: 'publishedAt',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Дата публикации',
          },
          {
            name: 'authorId',
            type: 'int',
            comment: 'Уникальный идентификатор автора статьи',
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата создания',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата последнего обновления',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      ArticleEntity.sqlAlias,
      new TableIndex({
        name: 'IDX_SLUG',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      ArticleEntity.sqlAlias,
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(ArticleEntity.sqlAlias);
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('authorId') !== -1);
    await queryRunner.dropForeignKey(ArticleEntity.sqlAlias, foreignKey);
    await queryRunner.dropIndex(ArticleEntity.sqlAlias, 'IDX_SLUG');
    await queryRunner.dropTable(ArticleEntity.sqlAlias);
  }
}
