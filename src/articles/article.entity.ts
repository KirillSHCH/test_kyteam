import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity(ArticleEntity.sqlAlias)
export class ArticleEntity {
  public static sqlAlias = 'articles';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  published: boolean;

  @Column({
    type: Date,
    nullable: true,
  })
  publishedAt: Date | null;

  @Column() authorId: number;
  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column() @Index({ unique: true }) slug: string;

  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
