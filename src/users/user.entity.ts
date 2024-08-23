import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(UserEntity.sqlAlias, { comment: 'Пользователи' })
export class UserEntity {
  public static sqlAlias = 'users';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Имя' })
  firstName: string;

  @Column({ comment: 'Фамилия' })
  secondName: string;

  @Column({ comment: 'Отчество', default: '' })
  middleName: string;

  @Column({ comment: 'email' })
  @Index({ unique: true })
  email: string;

  @Column({ select: false, comment: 'Пароль' })
  password: string;

  @CreateDateColumn({ type: 'timestamptz', comment: 'Дата создания' }) createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: 'Дата последнего обновления' })
  updatedAt!: Date;
}
