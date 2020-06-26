import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../../entities';
import { CreateTeacherDTO } from './dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  public async getAll(): Promise<CreateTeacherDTO[]> {
    return await this.teachersRepository
      .find()
      .then(teachers => teachers.map(e => CreateTeacherDTO.fromEntity(e)));
  }
  public async create(dto: CreateTeacherDTO): Promise<CreateTeacherDTO> {
    const teacher = this.teachersRepository.findOne({ dni: dto.dni });
    if (teacher) {
      throw new ConflictException(`Teacher with DNI ${dto.dni} already exists`);
    }
    return this.teachersRepository
      .save(dto)
      .then(e => CreateTeacherDTO.fromEntity(e));
  }
}
