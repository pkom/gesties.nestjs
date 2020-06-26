import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  Course,
  Teacher,
  CourseGroup,
  CourseGroupTeacher,
  CourseDepartmentTeacher,
  CourseDepartment,
} from '.';
import { TimeStampEntity } from '../common/shared/entities/timestamp.entity';

@Entity({ name: 'courses_teachers' })
export class CourseTeacher extends TimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @Column()
  teacherId: string;

  // Bidirectional ManyToMany Course to Teachers relationship
  // Teacher ->> CourseTeacher <<- Course
  @ManyToOne(
    () => Course,
    course => course.courseTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(
    () => Teacher,
    teacher => teacher.courseTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  // Bidirectional ManyToMany CourseGroup to CourseTeacher
  // CourseGroup ->> CourseGroupTeacher <<- CourseTeacher
  @OneToMany(
    () => CourseGroupTeacher,
    courseGroupTeacher => courseGroupTeacher.courseTeacher,
  )
  courseGroupTeachers: CourseGroupTeacher[];

  // Bidirectional ManyToMany CourseDepartment to CourseTeacher
  // CourseDepartment ->> CourseDepartmentTeacher <<- CourseTeacher
  @OneToMany(
    () => CourseDepartmentTeacher,
    courseDepartmentTeacher => courseDepartmentTeacher.courseTeacher,
  )
  courseDepartmentTeachers: CourseDepartmentTeacher[];

  // Bidirectional OneToOne Tutor Group relationship
  // CourseGroup <-> CourseTeacher
  @OneToOne(
    () => CourseGroup,
    courseGroup => courseGroup.tutorTeacher,
  )
  tutorGroup: CourseGroup;

  // Bidirectional OneToOne Head Department relationship
  // CourseDepartment <-> CourseTeacher
  @OneToOne(
    () => CourseDepartment,
    courseDepartment => courseDepartment.headTeacher,
  )
  headDepartment: CourseDepartment;
}
