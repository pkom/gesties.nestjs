import * as fs from 'fs';
import * as xml2js from 'xml2js';

import { CenterDTO, LevelDTO, LevelRayuelaDTO, TutorDTO } from '../dto';

export class ParseRayuelaGroups {
  private levelsDTO: LevelDTO[] = [];
  private centerDTO: CenterDTO;

  async parseFile(
    groupsXmlFile: string,
  ): Promise<{
    levelsDTO: LevelDTO[];
    centerDTO: CenterDTO;
  }> {
    try {
      const tutorGroupsData = await this.processGroupXML(groupsXmlFile);
      this.processData(tutorGroupsData);
      return {
        levelsDTO: this.levelsDTO,
        centerDTO: { ...this.centerDTO },
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private processGroupXML(groupsXmlFile: string) {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
      });
      fs.readFile(groupsXmlFile, 'latin1', (err, data) => {
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

  private processData(tutorGroupsData: any): void {
    const { centro: center, curso: tutorGroups } = tutorGroupsData[
      'grupos-centro'
    ];
    this.centerDTO = {
      code: center.codigo,
      denomination: center.denominacion,
    };
    this.processGroups(tutorGroups);
  }

  private processGroups(tutorGroups: LevelRayuelaDTO[]) {
    for (const tutorGroup of tutorGroups) {
      const tutorsDTO: TutorDTO[] = [];
      if (tutorGroup['grupo-curso'] instanceof Array) {
        for (const tutorGroupRayuelaDTO of tutorGroup['grupo-curso']) {
          const tutorDTO: TutorDTO = {
            group: tutorGroupRayuelaDTO['nombre-grupo'],
            dni: tutorGroupRayuelaDTO['dni-tutor-grupo'],
          };
          tutorsDTO.push(tutorDTO);
        }
      } else {
        tutorsDTO.push({
          group: tutorGroup['grupo-curso']['nombre-grupo'],
          dni: tutorGroup['grupo-curso']['dni-tutor-grupo'],
        });
      }
      const levelDto: LevelDTO = {
        level: tutorGroup['nombre-curso'],
        groups: tutorsDTO,
      };
      this.levelsDTO.push(levelDto);
    }
  }
}
