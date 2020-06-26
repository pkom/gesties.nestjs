import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entities';
import { CreateCourseDTO } from './dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  public async getAll(): Promise<CreateCourseDTO[]> {
    return await this.coursesRepository
      .find()
      .then(courses => courses.map(e => CreateCourseDTO.fromEntity(e)));
  }
  public async create(dto: CreateCourseDTO): Promise<CreateCourseDTO> {
    const course = this.coursesRepository.findOne({ course: dto.course });
    if (course) {
      throw new ConflictException(`Course ${dto.course} already exists`);
    }
    return this.coursesRepository
      .save(dto)
      .then(e => CreateCourseDTO.fromEntity(e));
  }
}
