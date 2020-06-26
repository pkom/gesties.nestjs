import { Repository } from 'typeorm';

import { CenterDTO } from '../dto';
import { Center } from '../../../entities';

export class ImportCenter {
  constructor(
    private readonly centerDTO: CenterDTO,
    private readonly centerRepo: Repository<Center>,
  ) {}

  async run(): Promise<Center> {
    return await this.saveCenter();
  }

  private async saveCenter(): Promise<Center> {
    let center = await this.centerRepo.findOne({
      where: [
        {
          code: this.centerDTO.code,
        },
        {
          denomination: this.centerDTO.denomination,
        },
      ],
    });
    if (!center) {
      center = new Center();
      center.code = this.centerDTO.code;
      center.denomination = this.centerDTO.denomination;
    }
    return await this.centerRepo.save(center);
  }
}
