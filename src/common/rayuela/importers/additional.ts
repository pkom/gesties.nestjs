import * as moment from 'moment';
import * as XLSX from 'xlsx';
const {
  read,
  // eslint-disable-next-line @typescript-eslint/camelcase
  utils: { sheet_to_json },
} = XLSX;
import * as NodeGeocoder from 'node-geocoder';

import { Connection, Repository } from 'typeorm';

import { AdditionalDTO, Coordinate } from '../dto';
import { Parent, Student } from '../../../entities';

export class ImportAdditionalStudentsData {
  private additionalsDTO: AdditionalDTO[] = [];
  private readonly geocoder: NodeGeocoder.Geocoder;

  constructor(
    private readonly studentsAdditionalDataXlsFile: string,
    private readonly connection: Connection,
    private readonly geo: boolean,
  ) {
    this.geocoder = NodeGeocoder({
      provider: 'google',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  }

  private readFirstSheetStudents(
    data: any,
    options: XLSX.ParsingOptions,
  ): AdditionalDTO[] {
    const wb: XLSX.WorkBook = read(data, options);
    const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
    return sheet_to_json(ws, { range: 4 });
  }

  async processAdditionalStudentsData(): Promise<void> {
    this.additionalsDTO = this.readFirstSheetStudents(
      this.studentsAdditionalDataXlsFile,
      {
        type: 'file',
        cellDates: true,
      },
    );
  }

  async processAdditionalDataStudent(studentDTO: AdditionalDTO): Promise<any> {
    const studentRepo = this.connection.getRepository(Student);
    const parentRepo = this.connection.getRepository(Parent);
    const student = await studentRepo.findOne({
      nie: studentDTO['Nº Id. Escolar'],
    });
    const parent1 = new Parent();
    const parent2 = new Parent();
    parent1.middleName = studentDTO['Primer apellido Primer tutor'];
    parent1.lastName = studentDTO['Segundo apellido Primer tutor'];
    parent1.firstName = studentDTO['Nombre Primer tutor'];
    if (studentDTO['DNI/Pasaporte Primer tutor']) {
      parent1.idNumber = studentDTO['DNI/Pasaporte Primer tutor'];
    }
    parent1.phone =
      studentDTO['Teléfono Primer tutor'] +
      (studentDTO['Tlfno. urgencias Primer tutor']
        ? '/' + studentDTO['Tlfno. urgencias Primer tutor']
        : '');
    parent1.email = studentDTO['Correo electrónico Primer tutor'] || '';

    parent2.middleName = studentDTO['Primer apellido Segundo tutor'];
    parent2.lastName = studentDTO['Segundo apellido Segundo tutor'];
    parent2.firstName = studentDTO['Nombre Segundo tutor'];
    if (studentDTO['DNI/Pasaporte Segundo tutor']) {
      parent2.idNumber = studentDTO['DNI/Pasaporte Segundo tutor'];
    }
    parent2.phone =
      studentDTO['Teléfono Segundo tutor'] +
      (studentDTO['Tlfno. urgencias Segundo tutor']
        ? '/' + studentDTO['Tlfno. urgencias Segundo tutor']
        : '');
    parent2.email = studentDTO['Correo electrónico Segundo tutor'] || '';

    let par1: Parent = null;
    let par2: Parent = null;
    if (parent1.idNumber) {
      par1 = await parentRepo.findOne({ idNumber: parent1.idNumber });
      if (par1) {
        await parentRepo.update({ idNumber: par1.idNumber }, { ...parent1 });
      } else {
        par1 = await parentRepo.save(parent1);
      }
    }
    if (parent2.idNumber) {
      par2 = await parentRepo.findOne({ idNumber: parent2.idNumber });
      if (par2) {
        await parentRepo.update({ idNumber: par2.idNumber }, { ...parent2 });
      } else {
        par2 = await parentRepo.save(parent2);
      }
    }
    if (student) {
      student.parents = [];
      if (par1) {
        student.parents.push(par1);
      }
      if (par2) {
        student.parents.push(par2);
      }

      await studentRepo.save(student);

      const stud = new Student();
      if (studentDTO['DNI/Pasaporte']) {
        stud.idNumber = studentDTO['DNI/Pasaporte'];
      }
      stud.fileId = studentDTO['Nº Expte en el centro'];
      stud.phone =
        studentDTO.Teléfono +
        (studentDTO['Teléfono de urgencia']
          ? '/' + studentDTO['Teléfono de urgencia']
          : '');
      stud.address = studentDTO.Dirección;
      stud.city = studentDTO['Localidad de residencia'];
      stud.state = studentDTO['Provincia de residencia'];
      stud.zipCode = studentDTO['Código postal'].toString();
      stud.birthDate = moment(
        studentDTO['Fecha de nacimiento'],
        'DD/MM/YYYY',
      ).toDate();
      stud.email = studentDTO['Correo electrónico'];

      if (this.geo && stud && stud.address && stud.city) {
        const coordinates: Coordinate[] = await this.geocoder.geocode(
          `${stud.address} ${stud.city}`,
        );
        if (
          coordinates &&
          coordinates[0] &&
          coordinates[0].latitude &&
          coordinates[0].longitude
        ) {
          stud.latitude = coordinates[0].latitude;
          stud.longitude = coordinates[0].longitude;
        }
      }
      await studentRepo.update({ nie: student.nie }, { ...stud });
    }
  }

  getAdditionalsDTO(): AdditionalDTO[] {
    return this.additionalsDTO;
  }
}
