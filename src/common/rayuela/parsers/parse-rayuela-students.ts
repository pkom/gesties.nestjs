import * as moment from 'moment';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as xml2js from 'xml2js';
import * as tempDir from 'temp-dir';
import { CenterDTO, GroupDTO, StudentDTO, StudentRayuelaDTO } from '../dto';

// import Jimp from 'jimp'; ? needed if we want to process photo student

export class ParseRayuelaStudents {
  private readonly tmpFolder: string = path.resolve(tempDir, 'tmpRayuela');

  private studentsDTO: StudentDTO[] = [];
  private groupsDTO: GroupDTO[] = [];
  private centerDTO: CenterDTO;

  async parseFile(
    zipFile: string,
  ): Promise<{
    studentsDTO: Array<StudentDTO>;
    groupsDTO: Array<GroupDTO>;
    centerDTO: CenterDTO;
  }> {
    try {
      if (!fs.existsSync(zipFile)) {
        throw new Error(`File ${zipFile} not found`);
      }
      await this.unzip(zipFile);
      this.checkZipFile();
      const studentsData = await this.processStudentsXML();
      this.processData(studentsData);
      return {
        studentsDTO: this.studentsDTO,
        groupsDTO: this.groupsDTO,
        centerDTO: { ...this.centerDTO },
      };
    } catch (e) {
      throw new Error(e.message);
    } finally {
      this.deleteTempFolder();
    }
  }

  private unzip(zipFile: string) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipFile)
        .pipe(unzipper.Extract({ path: this.tmpFolder }))
        .on('close', () => {
          resolve();
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  private checkZipFile() {
    if (!fs.existsSync(path.join(this.tmpFolder, 'Alumnos.xml'))) {
      throw new Error('Students XML file not found on unzipped folder');
    }
  }

  private processStudentsXML() {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
      });
      fs.readFile(
        path.join(this.tmpFolder, 'Alumnos.xml'),
        'latin1',
        (err, data) => {
          if (err) {
            reject(err);
          }
          parser.parseString(data, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        },
      );
    });
  }

  private processData(studentsData: any): void {
    const { centro: center, alumno: students } = studentsData[
      'alumnado-centro'
    ];
    this.centerDTO = {
      code: center.codigo,
      denomination: center.denominacion,
    };
    this.processStudents(students);
  }

  private processStudents(students: Partial<StudentRayuelaDTO>[]) {
    for (const student of students) {
      const studentDTO: StudentDTO = {
        nie: parseInt(student.nie),
        firstName: student.nombre,
        middleName: student['primer-apellido'],
        birthDate: moment(student['fecha-nacimiento'], 'DD/MM/YYYY').toDate(),
      };
      if (student['segundo-apellido']) {
        studentDTO.lastName = student['segundo-apellido'];
      }
      if (
        student['datos-usuario-rayuela'] &&
        student['datos-usuario-rayuela'].login
      ) {
        studentDTO.rayuela = {
          login: student['datos-usuario-rayuela'].login,
          id: parseInt(student['datos-usuario-rayuela']['id-usuario']),
        };
      }
      if (student.foto && student.foto['nombre-fichero']) {
        studentDTO.photoFile = student.foto['nombre-fichero'];
        const photoFile = path.join(
          this.tmpFolder,
          student.foto['nombre-fichero'],
        );
        studentDTO.photoBase64 = fs.readFileSync(photoFile).toString('base64');
      }
      this.studentsDTO.push(studentDTO);
      if (student.grupo) {
        this.addStudentToGroup(parseInt(student.nie), student.grupo);
      }
    }
  }

  private addStudentToGroup(nie: number, group: string): void {
    const idxGroup = this.groupsDTO.findIndex(
      itemGroup => itemGroup.group === group,
    );
    if (idxGroup !== -1) {
      this.groupsDTO[idxGroup].students.push(nie);
    } else {
      this.groupsDTO.push({
        group: group,
        denomination: group,
        students: [nie],
        teachers: [],
      });
    }
  }

  private deleteTempFolder() {
    if (this.tmpFolder) {
      rimraf.sync(this.tmpFolder);
    }
  }
}
