import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { CourseGroup, CourseTeacher } from '.';
import { TimeStampEntity } from '../common/shared/entities/timestamp.entity';

@Entity({ name: 'courses_groups_teachers' })
export class CourseGroupTeacher extends TimeStampEntity {
  @PrimaryColumn('uuid')
  courseGroupId: string;

  @PrimaryColumn('uuid')
  courseTeacherId: string;

  // Bidirectional ManyToMany CourseGroup to CourseTeacher
  // CourseGroup ->> CourseGroupTeacher <<- CourseTeacher
  @ManyToOne(
    () => CourseGroup,
    courseGroup => courseGroup.courseGroupTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'courseGroupId' })
  courseGroup: CourseGroup;

  @ManyToOne(
    () => CourseTeacher,
    courseTeacher => courseTeacher.courseGroupTeachers,
    { primary: true },
  )
  @JoinColumn({ name: 'courseTeacherId' })
  courseTeacher: CourseTeacher;
}
