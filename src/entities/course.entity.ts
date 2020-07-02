import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  CourseStudent,
  CourseTeacher,
  CourseGroup,
  CourseDepartment,
} from './';

@Entity({ name: 'courses' })
export class Course extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 9 })
  course: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  denomination: string;

  // Bidirectional ManyToMany Course to Students relationship
  // Course ->> CourseStudent <<- Student
  @OneToMany(
    () => CourseStudent,
    courseStudent => courseStudent.course,
  )
  courseStudents: CourseStudent[];

  // Bidirectional ManyToMany Course to Teachers relationship
  // Course ->> CourseTeacher <<- Teacher

  @OneToMany(
    () => CourseTeacher,
    courseTeacher => courseTeacher.course,
  )
  courseTeachers: CourseTeacher[];

  // Bidirectional ManyToMany Course to Groups
  // Course ->> CourseGroup <<- Group

  @OneToMany(
    () => CourseGroup,
    courseGroup => courseGroup.course,
  )
  courseGroups: CourseGroup[];

  // Bidirectional ManyToMany Course to Departments
  // Course ->> CourseDepartment <<- Department

  @OneToMany(
    () => CourseDepartment,
    courseDepartment => courseDepartment.course,
  )
  courseDepartments: CourseDepartment[];
}
