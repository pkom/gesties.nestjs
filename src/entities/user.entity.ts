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
  uid: string;

  @Column({ type: 'varchar', length: 25 })
  uidNumber: string;

  @Column({ type: 'varchar', length: 25 })
  gidNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sn: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  givenName: string;

  @Column({ type: 'varchar', length: 25 })
  employeeNumber: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cn: string;

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
