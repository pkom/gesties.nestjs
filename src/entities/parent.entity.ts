import { Entity, ManyToMany } from 'typeorm';
import { PersonEntity } from './person.entity';
import { Student } from '.';

@Entity({ name: 'parents' })
export class Parent extends PersonEntity {
  // Bidirectional ManyToMany Student to Parent
  // Student ->> StudentParent <<- Parent
  @ManyToMany(
    () => Student,
    student => student.parents,
  )
  students: Student[];
}
