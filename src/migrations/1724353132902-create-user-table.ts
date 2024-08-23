import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { UserEntity } from '../users/user.entity';

export class CreateUserTable1724353132902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: UserEntity.sqlAlias,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'ID пользователя',
          },
          {
            name: 'firstName',
            type: 'varchar',
            comment: 'Имя',
          },
          {
            name: 'secondName',
            type: 'varchar',
            comment: 'Фамилия',
          },
          {
            name: 'middleName',
            type: 'varchar',
            default: "''",
            comment: 'Отчество',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            comment: 'Email',
          },
          {
            name: 'password',
            type: 'varchar',
            comment: 'Пароль',
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
      true,
    );

    await queryRunner.createIndex(
      UserEntity.sqlAlias,
      new TableIndex({
        name: 'IDX_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(UserEntity.sqlAlias, 'IDX_EMAIL');
    await queryRunner.dropTable(UserEntity.sqlAlias);
  }
}
