import {
  Injectable,
  ConflictException,
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

  public async getAll(): Promise<Center[]> {
    return await this.centersRepository.find();
  }

  public async getById(id: string): Promise<Center> {
    const center = await this.centersRepository.findOne(id);
    if (!center) {
      throw new NotFoundException('Center does not exist');
    }
    return center;
  }

  public async create(centerDTO: CenterDTO): Promise<Center> {
    const center = await this.centersRepository.findOne({
      code: centerDTO.code,
    });
    if (center) {
      throw new ConflictException(`Center ${centerDTO.code} already exists`);
    }
    return await this.centersRepository.save(centerDTO);
  }

  public async update(id: string, centerDTO: CenterDTO): Promise<Center> {
    const center = await this.getById(id);
    await this.centersRepository.update(center.id, centerDTO);
    return await this.getById(center.id);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.centersRepository.delete(id);
  }
}
