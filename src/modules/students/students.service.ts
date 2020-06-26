import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities';
import { CreateStudentDTO } from './dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  public async getAll(): Promise<CreateStudentDTO[]> {
    return await this.studentsRepository
      .find()
      .then(students => students.map(e => CreateStudentDTO.fromEntity(e)));
  }
  public async create(dto: CreateStudentDTO): Promise<CreateStudentDTO> {
    const student = this.studentsRepository.findOne({ nie: dto.nie });
    if (student) {
      throw new ConflictException(`Student with NIE ${dto.nie} already exists`);
    }
    return this.studentsRepository
      .save(dto)
      .then(e => CreateStudentDTO.fromEntity(e));
  }
}
