import { Connection } from 'typeorm';

import { GroupDTO } from '../dto';
import {
  Course,
  Group,
  Student,
  Teacher,
  CourseGroup,
  CourseStudent,
  CourseTeacher,
  CourseGroupStudent,
  CourseGroupTeacher,
} from '../../../entities';

export class ImportGroups {
  constructor(
    private readonly connection: Connection,
    private readonly course: Course,
  ) {}

  async processGroup(groupDTO: GroupDTO): Promise<void> {
    const groupRepo = this.connection.getRepository(Group);
    const courseGroupRepo = this.connection.getRepository(CourseGroup);
    const courseStudentRepo = this.connection.getRepository(CourseStudent);
    const courseTeacherRepo = this.connection.getRepository(CourseTeacher);
    const courseGroupStudentRepo = this.connection.getRepository(
      CourseGroupStudent,
    );
    const courseGroupTeacherRepo = this.connection.getRepository(
      CourseGroupTeacher,
    );
    const studentRepo = this.connection.getRepository(Student);
    const teacherRepo = this.connection.getRepository(Teacher);

    let group = await groupRepo.findOne({ group: groupDTO.group });
    if (!group) {
      group = await groupRepo.save({
        group: groupDTO.group,
        denomination: groupDTO.denomination,
      });
    } else {
      await groupRepo.update(group.id, { group: groupDTO.group });
    }
    group = await groupRepo.findOne(group.id);
    let courseGroup = await courseGroupRepo.findOne({
      course: this.course,
      group,
    });
    if (!courseGroup) {
      courseGroup = await courseGroupRepo.save({
        course: this.course,
        group,
      });
    }

    await courseGroupStudentRepo.delete({ courseGroupId: courseGroup.id });
    await courseGroupTeacherRepo.delete({ courseGroupId: courseGroup.id });

    for (const nie of groupDTO.students) {
      const student = await studentRepo.findOne({ nie: nie });
      const courseStudent = await courseStudentRepo.findOne({
        courseId: courseGroup.courseId,
        studentId: student.id,
      });
      const cgs = new CourseGroupStudent();
      cgs.courseGroup = courseGroup;
      cgs.courseStudent = courseStudent;
      await courseGroupStudentRepo.save(cgs);
    }
    for (const dni of groupDTO.teachers) {
      const teacher = await teacherRepo.findOne({ dni: dni });
      const courseTeacher = await courseTeacherRepo.findOne({
        courseId: courseGroup.courseId,
        teacherId: teacher.id,
      });
      const cgt = new CourseGroupTeacher();
      cgt.courseGroup = courseGroup;
      cgt.courseTeacher = courseTeacher;
      await courseGroupTeacherRepo.save(cgt);
    }
  }
}
