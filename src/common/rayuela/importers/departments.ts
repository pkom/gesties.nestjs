import { Connection } from 'typeorm';

import { DepartmentDTO } from '../dto';
import {
  Course,
  Department,
  Teacher,
  CourseTeacher,
  CourseDepartment,
  CourseDepartmentTeacher,
} from '../../../entities';

export class ImportDepartments {
  constructor(
    private readonly connection: Connection,
    private readonly course: Course,
  ) {}

  async processDepartment(departmentDTO: DepartmentDTO): Promise<void> {
    const departmentRepo = this.connection.getRepository(Department);
    const courseDepartmentRepo = this.connection.getRepository(
      CourseDepartment,
    );
    const teacherRepo = this.connection.getRepository(Teacher);
    const courseTeacherRepo = this.connection.getRepository(CourseTeacher);
    const courseDepartmentTeacherRepo = this.connection.getRepository(
      CourseDepartmentTeacher,
    );

    let department = await departmentRepo.findOne({
      department: departmentDTO.department,
    });
    if (!department) {
      department = await departmentRepo.save({
        department: departmentDTO.department,
        denomination: departmentDTO.denomination,
      });
    } else {
      await departmentRepo.update(department.id, {
        department: departmentDTO.department,
      });
    }
    department = await departmentRepo.findOne(department.id);
    let courseDepartment = await courseDepartmentRepo.findOne({
      course: this.course,
      department,
    });
    if (!courseDepartment) {
      courseDepartment = await courseDepartmentRepo.save({
        course: this.course,
        department,
      });
    }

    await courseDepartmentTeacherRepo.delete({
      courseDepartmentId: courseDepartment.id,
    });

    for (const dni of departmentDTO.teachers) {
      const teacher = await teacherRepo.findOne({ dni: dni });
      const courseTeacher = await courseTeacherRepo.findOne({
        courseId: courseDepartment.courseId,
        teacherId: teacher.id,
      });
      const cgt = new CourseDepartmentTeacher();
      cgt.courseDepartment = courseDepartment;
      cgt.courseTeacher = courseTeacher;
      await courseDepartmentTeacherRepo.save(cgt);
    }
  }

  // private async processDepartments(
  //   departments: DepartmentDTO[],
  // ): Promise<void> {
  //   const departmentRepo = this.connection.getRepository(Department);
  //   const courseDepartmentRepo = this.connection.getRepository(
  //     CourseDepartment,
  //   );
  //
  //   for (const departmentDTO of departments) {
  //     let department = await departmentRepo.findOne({
  //       department: departmentDTO.department,
  //     });
  //     if (!department) {
  //       department = await departmentRepo.save({
  //         department: departmentDTO.department,
  //         denomination: departmentDTO.denomination,
  //       });
  //     } else {
  //       await departmentRepo.update(department.id, {
  //         department: departmentDTO.department,
  //       });
  //     }
  //     department = await departmentRepo.findOne(department.id);
  //     let courseDepartment = await courseDepartmentRepo.findOne({
  //       courseId: this.course.id,
  //       departmentId: department.id,
  //     });
  //     if (!courseDepartment) {
  //       courseDepartment = await courseDepartmentRepo.save({
  //         course: this.course,
  //         department,
  //       });
  //     }
  //     await this.processTeacherDepartment(departmentDTO, courseDepartment);
  //     this.emit(Events.DEPARTMENT_PROCESSED);
  //   }
  // }
  //
  // private async processTeacherDepartment(
  //   departmentDTO: DepartmentDTO,
  //   courseDepartment: CourseDepartment,
  // ): Promise<void> {
  //   // const courseDepartmentRepo = this.connection.getRepository(
  //   //   CourseDepartment,
  //   // );
  //   const courseTeacherRepo = this.connection.getRepository(CourseTeacher);
  //   const teacherRepo = this.connection.getRepository(Teacher);
  //   const courseDepartmentTeacherRepo = this.connection.getRepository(
  //     CourseDepartmentTeacher,
  //   );
  //   await courseDepartmentTeacherRepo.delete({
  //     courseDepartmentId: courseDepartment.id,
  //   });
  //   for (const dni of departmentDTO.teachers) {
  //     const teacher = await teacherRepo.findOne({ dni: dni });
  //     const courseTeacher = await courseTeacherRepo.findOne({
  //       courseId: courseDepartment.courseId,
  //       teacherId: teacher.id,
  //     });
  //     const cdt = new CourseDepartmentTeacher();
  //     cdt.courseDepartment = courseDepartment;
  //     cdt.courseTeacher = courseTeacher;
  //     await courseDepartmentTeacherRepo.save(cdt);
  //   }
  // }
}
