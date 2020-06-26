import { Connection, Repository } from 'typeorm';

import { ParseRayuelaTeachers } from '../parsers';
import { CenterDTO, DepartmentDTO, GroupDTO, TeacherDTO } from '../dto';
import { Course, CourseTeacher, Teacher } from '../../../entities';

export class ImportTeachers {
  private groupsDTO: GroupDTO[] = [];
  private departmentsDTO: DepartmentDTO[] = [];
  private teachersDTO: TeacherDTO[] = [];
  private centerDTO: CenterDTO;
  private teacherRepo: Repository<Teacher>;
  private courseTeacherRepo: Repository<CourseTeacher>;

  constructor(
    private readonly teachersXmlFile: string,
    private readonly connection: Connection,
    private readonly course: Course,
  ) {
    this.teacherRepo = this.connection.getRepository(Teacher);
    this.courseTeacherRepo = this.connection.getRepository(CourseTeacher);
  }

  async getRayuelaData(): Promise<void> {
    const parseRayuelaTeachers = new ParseRayuelaTeachers();
    const {
      teachersDTO,
      groupsDTO,
      departmentsDTO,
      centerDTO,
    } = await parseRayuelaTeachers.parseFile(this.teachersXmlFile);
    this.groupsDTO = groupsDTO;
    this.teachersDTO = teachersDTO;
    this.departmentsDTO = departmentsDTO;
    this.centerDTO = centerDTO;
  }

  async processTeacher(teacherDTO: TeacherDTO): Promise<void> {
    let teacher = await this.teacherRepo.findOne({ dni: teacherDTO.dni });
    if (!teacher) {
      teacher = await this.teacherRepo.save({
        ...teacherDTO,
      });
    } else {
      await this.teacherRepo.update(teacher.id, { ...teacherDTO });
    }
    const courseTeacher = await this.courseTeacherRepo.findOne({
      course: this.course,
      teacher,
    });
    if (!courseTeacher) {
      await this.courseTeacherRepo.save({ course: this.course, teacher });
    }
  }

  getGroupsDTO(): GroupDTO[] {
    return this.groupsDTO;
  }

  getDepartmentsDTO(): DepartmentDTO[] {
    return this.departmentsDTO;
  }

  getTeachersDTO(): TeacherDTO[] {
    return this.teachersDTO;
  }

  getCenterDTO(): CenterDTO {
    return this.centerDTO;
  }
}
