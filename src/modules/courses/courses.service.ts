import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entities';
import { CourseDTO } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  public async getAll(): Promise<Course[]> {
    return await this.coursesRepository.find();
  }

  public async getById(id): Promise<Course> {
    const course = await this.coursesRepository.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} does not exist`);
    }
    return course;
  }

  public async create(courseDTO: CourseDTO): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      course: courseDTO.course,
    });
    if (course) {
      throw new ConflictException(`Course ${courseDTO.course} already exists`);
    }
    return await this.coursesRepository.save(courseDTO);
  }

  public async update(id: string, courseDTO: CourseDTO): Promise<Course> {
    const course = await this.getById(id);
    await this.coursesRepository.update(course.id, courseDTO);
    return await this.getById(course.id);
  }

  public async delete(id: string): Promise<void> {
    const course = await this.getById(id);
    await this.coursesRepository.remove(course);
  }
}
