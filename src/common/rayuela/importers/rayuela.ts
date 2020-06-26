import { EventEmitter } from 'events';

import { Connection } from 'typeorm';

import { Center, Course } from '../../../entities';
import { DepartmentDTO, GroupDTO } from '../dto';

import { ImportCourse } from './course';
import { getConnection } from './connection';
import { ImportCenter } from './center';
import { ImportStudents } from './student';
import { ImportTeachers } from './teacher';
import { ImportGroups } from './groups';
import { ImportDepartments } from './departments';
import { ImportTutors } from './tutors';
import { ImportAdditionalStudentsData } from './additional';
import { ImportParents } from './parents';

export enum Events {
  STUDENTS_STARTED = 'students_started',
  STUDENTS_FINISHED = 'students_finished',
  STUDENT_PROCESSED = 'student_processed',
  TEACHERS_STARTED = 'teachers_started',
  TEACHERS_FINISHED = 'teachers_finished',
  TEACHER_PROCESSED = 'teacher_processed',
  GROUPS_STARTED = 'groups_started',
  GROUPS_FINISHED = 'groups_finished',
  GROUP_PROCESSED = 'group_processed',
  DEPARTMENTS_STARTED = 'departments_started',
  DEPARTMENTS_FINISHED = 'departments_finished',
  DEPARTMENT_PROCESSED = 'department_processed',
  ADDITIONALS_STARTED = 'additionals_started',
  ADDITIONALS_FINISHED = 'additionals_finished',
  ADDITIONAL_PROCESSED = 'additional_processed',
  PARENTS_STARTED = 'parents_started',
  PARENTS_FINISHED = 'parents_finished',
  PARENT_PROCESSED = 'parent_processed',
}

interface ArgsOptions {
  [key: string]: any;
}

export class Rayuela extends EventEmitter {
  private connection: Connection;
  private course: Course;
  private studentGroupsDTO: GroupDTO[] = [];
  private teacherGroupsDTO: GroupDTO[] = [];
  private departmentsDTO: DepartmentDTO[] = [];

  constructor(private readonly argsOptions: ArgsOptions) {
    super();
  }

  private async setup() {
    this.connection = await getConnection();
    this.course = await new ImportCourse(
      this.argsOptions.course,
      this.connection.getRepository(Course),
    ).run();
  }

  async process(): Promise<void> {
    await this.setup();

    if (this.argsOptions.studentsZipFile) {
      await this.processStudentsZip();
    }

    if (this.argsOptions.teachersXmlFile) {
      await this.processTeachersXml();
    }

    await this.processGroups();

    if (this.argsOptions.groupsXmlFile) {
      await this.processTutorsXml();
    }
    if (this.argsOptions.studentsAdditionalDataXlsFile) {
      await this.processAdditionalStudentsData();
    }
    if (this.argsOptions.parentsDataXlsFile) {
      await this.processParents();
    }
  }

  private async processStudentsZip(): Promise<any> {
    const importStudents = new ImportStudents(
      this.argsOptions.studentsZipFile,
      this.connection,
      this.course,
    );
    await importStudents.getRayuelaData();
    const studentsDTO = importStudents.getStudentsDTO();
    const groupsDTO = importStudents.getGroupsDTO();
    const centerDTO = importStudents.getCenterDTO();
    await new ImportCenter(
      centerDTO,
      this.connection.getRepository(Center),
    ).run();
    this.studentGroupsDTO = [...groupsDTO];
    this.emit(Events.STUDENTS_STARTED, studentsDTO.length);
    for (const studentDTO of studentsDTO) {
      await importStudents.processStudent(studentDTO);
      this.emit(Events.STUDENT_PROCESSED);
    }
    this.emit(Events.STUDENTS_FINISHED);
  }

  private async processTeachersXml(): Promise<any> {
    const importTeachers = new ImportTeachers(
      this.argsOptions.teachersXmlFile,
      this.connection,
      this.course,
    );
    await importTeachers.getRayuelaData();
    const teachersDTO = importTeachers.getTeachersDTO();
    const groupsDTO = importTeachers.getGroupsDTO();
    const departmentsDTO = importTeachers.getDepartmentsDTO();
    const centerDTO = importTeachers.getCenterDTO();
    await new ImportCenter(
      centerDTO,
      this.connection.getRepository(Center),
    ).run();
    this.teacherGroupsDTO = [...groupsDTO];
    this.departmentsDTO = [...departmentsDTO];
    this.emit(Events.TEACHERS_STARTED, teachersDTO.length);
    for (const teacherDTO of teachersDTO) {
      await importTeachers.processTeacher(teacherDTO);
      this.emit(Events.TEACHER_PROCESSED);
    }
    this.emit(Events.TEACHERS_FINISHED);

    await this.processDepartments();
  }

  private async processDepartments(): Promise<void> {
    const importDepartments = new ImportDepartments(
      this.connection,
      this.course,
    );
    this.emit(Events.DEPARTMENTS_STARTED, this.departmentsDTO.length);
    for (const departmentDTO of this.departmentsDTO) {
      await importDepartments.processDepartment(departmentDTO);
      this.emit(Events.DEPARTMENT_PROCESSED);
    }
    this.emit(Events.DEPARTMENTS_FINISHED);
  }

  private async processGroups(): Promise<void> {
    const groupsDTO = [...this.studentGroupsDTO];
    for (const group of this.teacherGroupsDTO) {
      const idxGroup = groupsDTO.findIndex(
        itemGroup => itemGroup.group === group.group,
      );
      if (idxGroup !== -1) {
        groupsDTO[idxGroup].teachers = [...group.teachers];
      } else {
        groupsDTO.push(group);
      }
    }
    const importGroups = new ImportGroups(this.connection, this.course);
    this.emit(Events.GROUPS_STARTED, groupsDTO.length);
    for (const groupDTO of groupsDTO) {
      await importGroups.processGroup(groupDTO);
      this.emit(Events.GROUP_PROCESSED);
    }
    this.emit(Events.GROUPS_FINISHED);
  }

  private async processTutorsXml(): Promise<any> {
    const importTutors = new ImportTutors(
      this.argsOptions.groupsXmlFile,
      this.connection,
      this.course,
    );
    await importTutors.getRayuelaData();
    const levelsDTO = importTutors.getLevelsDTO();
    const centerDTO = importTutors.getCenterDTO();
    await new ImportCenter(
      centerDTO,
      this.connection.getRepository(Center),
    ).run();
    for (const levelDTO of levelsDTO) {
      await importTutors.processLevel(levelDTO);
    }
  }

  private async processAdditionalStudentsData(): Promise<any> {
    const importAdditionalStudentsData = new ImportAdditionalStudentsData(
      this.argsOptions.studentsAdditionalDataXlsFile,
      this.connection,
      this.argsOptions.geo,
    );
    await importAdditionalStudentsData.processAdditionalStudentsData();
    const additionalsDTO = importAdditionalStudentsData.getAdditionalsDTO();
    this.emit(Events.ADDITIONALS_STARTED, additionalsDTO.length);
    for (const additionalDTO of additionalsDTO) {
      await importAdditionalStudentsData.processAdditionalDataStudent(
        additionalDTO,
      );
      this.emit(Events.ADDITIONAL_PROCESSED);
    }
    this.emit(Events.ADDITIONALS_FINISHED);
  }

  private async processParents(): Promise<any> {
    const importParents = new ImportParents(
      this.argsOptions.parentsDataXlsFile,
      this.connection,
      this.argsOptions.geo,
    );
    await importParents.processParentsData();
    const parentsDTO = importParents.getParentsDTO();
    this.emit(Events.PARENTS_STARTED, parentsDTO.length);
    for (const parentDTO of parentsDTO) {
      await importParents.processParentData(parentDTO);
      this.emit(Events.PARENT_PROCESSED);
    }
    this.emit(Events.PARENTS_FINISHED);
  }
}
