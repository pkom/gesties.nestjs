import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from '../../entities';
import { Repository } from 'typeorm';

import { ConfigurationDTO } from './dto/configuration.dto';
import { CoursesService } from '../courses/courses.service';
@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    private readonly coursesService: CoursesService,
  ) {}

  public async get(): Promise<Configuration> {
    try {
      return await this.configurationRepository.findOne();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async create(
    configurationDTO: ConfigurationDTO,
  ): Promise<ConfigurationDTO> {
    const configuration = await this.configurationRepository.findOne();
    if (configuration) {
      throw new ConflictException(`A configuration already exists`);
    }
    return this.configurationRepository.save(configurationDTO).then(e => e);
  }

  public async setDefaultCourse(courseId: string): Promise<void> {
    const course = await this.coursesService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course id ${courseId} was not found`);
    }
    const configuration = await this.configurationRepository.findOne();
    if (!configuration) {
      throw new NotFoundException(
        'A configuration was not found, please create one',
      );
    }
    configuration.defaultCourse = course;
    this.configurationRepository.save(configuration);
  }
}
