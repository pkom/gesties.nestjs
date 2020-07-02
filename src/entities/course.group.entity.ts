import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Course, Group, CourseStudent, CourseGroupStudent, CourseTeacher, CourseGroupTeacher } from '.';
import { TimeStampEntity } from './timestamp.entity';

@Entity({ name: 'courses_groups' })
export class CourseGroup extends TimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @Column()
  groupId: string;

  // Bidirectional ManyToMany Course to Groups
  // Course ->> CourseGroup <<- Group
  @ManyToOne(
    () => Course,
    course => course.courseGroups,
    { primary: true },
  )
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(
    () => Group,
    group => group.courseGroups,
    { primary: true },
  )
  @JoinColumn({ name: 'groupId' })
  group: Group;

  // Bidirectional ManyToMany CourseGroup to CourseStudent
  // CourseGroup ->> CourseGroupStudent <<- CourseStudent
  @OneToMany(
    () => CourseGroupStudent,
    courseGroupStudent => courseGroupStudent.courseGroup,
  )
  courseGroupStudents: CourseGroupStudent[];

  // Bidirectional OneToOne Delegate Group relationship
  // CourseGroup <-> CourseStudent
  @OneToOne(
    () => CourseStudent,
    courseStudent => courseStudent.delegateGroup,
  )
  @JoinColumn({ name: 'delegateId' })
  delegateStudent: CourseStudent;

  // Bidirectional ManyToMany CourseGroup to CourseTeacher
  // CourseGroup ->> CourseGroupTeacher <<- CourseTeacher
  @OneToMany(
    () => CourseGroupTeacher,
    courseGroupTeacher => courseGroupTeacher.courseGroup,
  )
  courseGroupTeachers: CourseGroupTeacher[];

  // Bidirectional OneToOne Tutor Group relationship
  // CourseGroup <-> CourseTeacher
  @OneToOne(
    () => CourseTeacher,
    courseTeacher => courseTeacher.tutorGroup,
  )
  @JoinColumn({ name: 'tutorId' })
  tutorTeacher: CourseTeacher;
}
