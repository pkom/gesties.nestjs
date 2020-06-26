import { Connection, Repository } from 'typeorm';

import { ParseRayuelaStudents } from '../parsers';
import { CenterDTO, GroupDTO, StudentDTO } from '../dto';
import { Course, CourseStudent, Student } from '../../../entities';

export class ImportStudents {
  private groupsDTO: GroupDTO[] = [];
  private studentsDTO: StudentDTO[] = [];
  private centerDTO: CenterDTO;
  private studentRepo: Repository<Student>;
  private courseStudentRepo: Repository<CourseStudent>;

  constructor(
    private readonly studentsZipFile: string,
    private readonly connection: Connection,
    private readonly course: Course,
  ) {
    this.studentRepo = this.connection.getRepository(Student);
    this.courseStudentRepo = this.connection.getRepository(CourseStudent);
  }

  async getRayuelaData(): Promise<void> {
    const parseRayuelaStudents = new ParseRayuelaStudents();
    const {
      studentsDTO,
      groupsDTO,
      centerDTO,
    } = await parseRayuelaStudents.parseFile(this.studentsZipFile);
    this.groupsDTO = groupsDTO;
    this.studentsDTO = studentsDTO;
    this.centerDTO = centerDTO;
  }

  async processStudent(studentDTO: StudentDTO): Promise<void> {
    let student = await this.studentRepo.findOne({ nie: studentDTO.nie });
    if (!student) {
      student = await this.studentRepo.save({
        ...studentDTO,
      });
    } else {
      await this.studentRepo.update(student.id, { ...studentDTO });
    }
    const courseStudent = await this.courseStudentRepo.findOne({
      course: this.course,
      student,
    });
    if (!courseStudent) {
      await this.courseStudentRepo.save({ course: this.course, student });
    }
  }

  getGroupsDTO(): GroupDTO[] {
    return this.groupsDTO;
  }

  getStudentsDTO(): StudentDTO[] {
    return this.studentsDTO;
  }

  getCenterDTO(): CenterDTO {
    return this.centerDTO;
  }
}
