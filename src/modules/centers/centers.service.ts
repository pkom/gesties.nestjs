import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Center } from '../../entities';
import { Repository, DeleteResult } from 'typeorm';
import { CenterDTO } from './dto';

@Injectable()
export class CentersService {
  constructor(
    @InjectRepository(Center)
    private readonly centersRepository: Repository<Center>,
  ) {}

  public async getAll(): Promise<CenterDTO[]> {
    try {
      return await this.centersRepository
        .find()
        .then(centers => centers.map(e => CenterDTO.fromEntity(e)));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async create(centerDto: CenterDTO): Promise<CenterDTO> {
    const center = await this.centersRepository.findOne({
      code: centerDto.code,
    });
    if (center) {
      throw new ConflictException(
        `Center with code ${centerDto.code} already exists`,
      );
    }
    return this.centersRepository
      .save(centerDto)
      .then(e => CenterDTO.fromEntity(e));
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.centersRepository.delete(id);
  }
}
