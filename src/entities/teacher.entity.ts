import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany } from 'typeorm';

import { PersonEntity } from './person.entity';
import { Rayuela } from '../common/shared/entities/rayuela';
import { CourseTeacher } from '.';

@Entity({ name: 'teachers' })
export class Teacher extends PersonEntity {
  @Column({ unique: true })
  dni: string;

  @Exclude()
  @Column({ nullable: true })
  photoFile: string;

  @Exclude()
  @Column({ nullable: true })
  photoBase64: string;

  @Column(() => Rayuela)
  rayuela: Rayuela;

  // Bidirectional ManyToMany Teacher to Courses relationship
  // Teacher ->> CourseTeacher <<- Course
  @OneToMany(
    () => CourseTeacher,
    courseTeacher => courseTeacher.teacher,
  )
  courseTeachers: CourseTeacher[];
}
