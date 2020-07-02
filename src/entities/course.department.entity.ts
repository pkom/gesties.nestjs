import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Course, Department, CourseTeacher, CourseDepartmentTeacher } from '.';
import { TimeStampEntity } from './timestamp.entity';

@Entity({ name: 'courses_departments' })
export class CourseDepartment extends TimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @Column()
  departmentId: string;

  // Bidirectional ManyToMany Course to Departments
  // Course ->> CourseDepartment <<- Department
  @ManyToOne(
    () => Course,
    course => course.courseDepartments,
    { primary: true },
  )
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(
    () => Department,
    department => department.courseDepartments,
    { primary: true },
  )
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Bidirectional ManyToMany CourseDepartment to CourseTeacher
  // CourseDepartment ->> CourseDepartmentTeacher <<- CourseTeacher
  @OneToMany(
    () => CourseDepartmentTeacher,
    courseDepartmentTeacher => courseDepartmentTeacher.courseDepartment,
  )
  courseDepartmentTeachers: CourseDepartmentTeacher[];

  // Bidirectional OneToOne Head Department relationship
  // CourseDepartment <-> CourseTeacher
  @OneToOne(
    () => CourseTeacher,
    courseTeacher => courseTeacher.headDepartment,
  )
  @JoinColumn({ name: 'headId' })
  headTeacher: CourseTeacher;
}
