import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { CourseDepartment, CourseTeacher } from '.';
import { TimeStampEntity } from './timestamp.entity';

@Entity({ name: 'courses_departments_teachers' })
export class CourseDepartmentTeacher extends TimeStampEntity {
  @PrimaryColumn('uuid')
  courseDepartmentId: string;

  @PrimaryColumn('uuid')
  courseTeacherId: string;

  // Bidirectional ManyToMany CourseDepartment to CourseTeacher
  // CourseDepartment ->> CourseDepartmentTeacher <<- CourseTeacher
  @ManyToOne(
    () => CourseDepartment,
    courseDepartment => courseDepartment.courseDepartmentTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'courseDepartmentId' })
  courseDepartment: CourseDepartment;

  @ManyToOne(
    () => CourseTeacher,
    courseTeacher => courseTeacher.courseDepartmentTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'courseTeacherId' })
  courseTeacher: CourseTeacher;
}
