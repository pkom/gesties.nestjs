import * as XLSX from 'xlsx';
const {
  read,
  // eslint-disable-next-line @typescript-eslint/camelcase
  utils: { sheet_to_json },
} = XLSX;
import * as NodeGeocoder from 'node-geocoder';

import { Connection } from 'typeorm';

import { ParentDTO, Coordinate } from '../dto';
import { Parent } from '../../../entities';

export class ImportParents {
  private parentsDTO: ParentDTO[] = [];
  private readonly geocoder: NodeGeocoder.Geocoder;

  constructor(
    private readonly parentsDataXlsFile: string,
    private readonly connection: Connection,
    private readonly geo: boolean,
  ) {
    this.geocoder = NodeGeocoder({
      provider: 'google',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  }

  private readFirstSheetParents(
    data: any,
    options: XLSX.ParsingOptions,
  ): ParentDTO[] {
    const wb: XLSX.WorkBook = read(data, options);
    const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
    return sheet_to_json(ws, { range: 4 });
  }

  async processParentsData(): Promise<void> {
    this.parentsDTO = this.readFirstSheetParents(this.parentsDataXlsFile, {
      type: 'file',
      cellDates: true,
    });
  }

  async processParentData(parentDTO: ParentDTO): Promise<any> {
    const parentRepo = this.connection.getRepository(Parent);
    if (!parentDTO['DNI/Pasaporte']) return;
    const parent = await parentRepo.findOne({
      idNumber: parentDTO['DNI/Pasaporte'],
    });
    parent.idNumber = parentDTO['DNI/Pasaporte'];
    parent.address = parentDTO.Domicilio;
    parent.city = parentDTO.Municipio;
    parent.state = parentDTO.Provincia;
    parent.zipCode = parentDTO['Código postal'].toString();
    parent.phone =
      parentDTO['Teléfono móvil'] +
      (parentDTO['Teléfono de urgencia']
        ? '/' + parentDTO['Teléfono de urgencia']
        : '');

    if (this.geo && parent && parent.address && parent.city) {
      const coordinates: Coordinate[] = await this.geocoder.geocode(
        `${parent.address} ${parent.city}`,
      );
      if (
        coordinates &&
        coordinates[0] &&
        coordinates[0].latitude &&
        coordinates[0].longitude
      ) {
        parent.latitude = coordinates[0].latitude;
        parent.longitude = coordinates[0].longitude;
      }
    }
    await parentRepo.save(parent);
  }

  getParentsDTO(): ParentDTO[] {
    return this.parentsDTO;
  }
}
