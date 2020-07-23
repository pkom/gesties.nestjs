import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Teacher } from '../../entities';
import { CreateTeacherDTO } from './dto';
import { TeachersRepository } from './teachers.repository';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(TeachersRepository)
    private readonly teachersRepository: TeachersRepository,
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

  public async save(teacher: Teacher): Promise<Teacher> {
    await this.teachersRepository.save(teacher);
    return await this.teachersRepository.findOne(teacher.id);
  }
}
