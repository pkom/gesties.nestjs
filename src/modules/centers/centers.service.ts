import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Center } from '../../entities';
import { Repository } from 'typeorm';
import { CenterDTO } from './dto';

@Injectable()
export class CentersService {
  constructor(
    @InjectRepository(Center)
    private readonly centersRepository: Repository<Center>,
  ) {}

  public async getAll(): Promise<CenterDTO[]> {
    return await this.centersRepository
      .find()
      .then(centers => centers.map(e => CenterDTO.fromEntity(e)));
  }
  public async create(dto: CenterDTO): Promise<CenterDTO> {
    const center = this.centersRepository.findOne({ code: dto.code });
    if (center) {
      throw new ConflictException(
        `Center with code ${dto.code} already exists`,
      );
    }
    return this.centersRepository.save(dto).then(e => CenterDTO.fromEntity(e));
  }
}
