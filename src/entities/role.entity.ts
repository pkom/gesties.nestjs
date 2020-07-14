import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity, User } from '.';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 25, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  description: string;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users: User[];
}
