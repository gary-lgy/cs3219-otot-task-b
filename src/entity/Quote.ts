import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Quote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  content?: string;

  @Column()
  authorName?: string;

  @Column()
  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt?: Date;
}
