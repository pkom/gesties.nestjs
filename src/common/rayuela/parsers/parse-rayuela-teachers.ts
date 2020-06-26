import * as fs from 'fs';
import * as xml2js from 'xml2js';
import {
  CenterDTO,
  DepartmentDTO,
  GroupDTO,
  TeacherDTO,
  TeacherRayuelaDTO,
} from '../dto';

// import Jimp from 'jimp'; ? needed if we want to process photo student

export class ParseRayuelaTeachers {
  private teachersDTO: TeacherDTO[] = [];
  private groupsDTO: GroupDTO[] = [];
  private departmentsDTO: DepartmentDTO[] = [];
  private centerDTO: CenterDTO;

  async parseFile(
    teachersXmlFile: string,
  ): Promise<{
    teachersDTO: Array<TeacherDTO>;
    groupsDTO: Array<GroupDTO>;
    departmentsDTO: Array<DepartmentDTO>;
    centerDTO: CenterDTO;
  }> {
    try {
      const teachersData = await this.processTeachersXML(teachersXmlFile);
      this.processData(teachersData);
      return {
        teachersDTO: this.teachersDTO,
        groupsDTO: this.groupsDTO,
        departmentsDTO: this.departmentsDTO,
        centerDTO: { ...this.centerDTO },
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private processTeachersXML(teachersXmlFile: string) {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
      });
      fs.readFile(teachersXmlFile, 'latin1', (err, data) => {
        if (err) {
          reject(err);
        }
        parser.parseString(data, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    });
  }

  private processData(teachersData: any): void {
    const { centro: center, profesor: teachers } = teachersData[
      'profesorado-centro'
    ];
    this.centerDTO = {
      code: center.codigo,
      denomination: center.denominacion,
    };
    this.processTeachers(teachers);
  }

  private processTeachers(teachers: Partial<TeacherRayuelaDTO>[]) {
    for (const teacher of teachers) {
      const teacherDTO: TeacherDTO = {
        dni: teacher.dni,
        idNumber: teacher.dni,
        firstName: teacher.nombre,
        middleName: teacher['primer-apellido'],
      };
      if (teacher['segundo-apellido']) {
        teacherDTO.lastName = teacher['segundo-apellido'];
      }
      if (
        teacher['datos-usuario-rayuela'] &&
        teacher['datos-usuario-rayuela'].login
      ) {
        teacherDTO.rayuela = {
          login: teacher['datos-usuario-rayuela'].login,
          id: parseInt(teacher['datos-usuario-rayuela']['id-usuario']),
        };
      }
      this.teachersDTO.push(teacherDTO);
      if (teacher.departamento) {
        this.addTeacherToDepartment(teacher.dni, teacher.departamento);
      }
      if (teacher.grupos && teacher.grupos.grupo) {
        this.addTeacherToGroup(
          teacher.dni,
          typeof teacher.grupos.grupo === 'object'
            ? teacher.grupos.grupo
            : [teacher.grupos.grupo],
        );
      }
    }
  }
  private addTeacherToDepartment(dni: string, department: string): void {
    const idxDepartment = this.departmentsDTO.findIndex(
      itemDepartment => itemDepartment.department === department,
    );
    if (idxDepartment !== -1) {
      this.departmentsDTO[idxDepartment].teachers.push(dni);
    } else {
      this.departmentsDTO.push({
        department: department,
        denomination: department,
        teachers: [dni],
      });
    }
  }

  private addTeacherToGroup(dni: string, groups: string[]): void {
    for (const group of groups) {
      const idxGroup = this.groupsDTO.findIndex(
        itemGroup => itemGroup.group === group,
      );
      if (idxGroup !== -1) {
        this.groupsDTO[idxGroup].teachers.push(dni);
      } else {
        this.groupsDTO.push({
          group: group,
          denomination: group,
          teachers: [dni],
          students: [],
        });
      }
    }
  }
}
