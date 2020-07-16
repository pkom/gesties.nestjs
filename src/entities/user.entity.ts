import { Exclude } from 'class-transformer';

import {
  Entity,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { BaseEntity, Student, Teacher, Role } from '.';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 25, unique: true })
  userName: string;

  @Exclude()
  @Column({ type: 'varchar', length: 25 })
  uidNumber: string;

  @Exclude()
  @Column({ type: 'varchar', length: 25 })
  gidNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 25 })
  employeeNumber: string;

  @Exclude()
  @Column({ type: 'varchar', length: 150, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 50, nullable: true })
  password: string;

  @OneToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToOne(() => Teacher, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToMany(
    () => Role,
    role => role.users,
  )
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
