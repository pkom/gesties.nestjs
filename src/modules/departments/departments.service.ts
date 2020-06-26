import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities';
import { CreateDepartmentDTO } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  public async getAll(): Promise<CreateDepartmentDTO[]> {
    return await this.departmentsRepository
      .find()
      .then(departments =>
        departments.map(e => CreateDepartmentDTO.fromEntity(e)),
      );
  }
  public async create(dto: CreateDepartmentDTO): Promise<CreateDepartmentDTO> {
    const department = this.departmentsRepository.findOne({
      department: dto.department,
    });
    if (department) {
      throw new ConflictException(
        `Department ${dto.department} already exists`,
      );
    }
    return this.departmentsRepository
      .save(dto)
      .then(e => CreateDepartmentDTO.fromEntity(e));
  }
}
