import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration, Course } from '../../entities';
import { Repository } from 'typeorm';

import { ConfigurationDTO } from './dto/configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  public async get(): Promise<Configuration> {
    const configuration = await this.configurationRepository.findOne();
    if (!configuration) {
      throw new NotFoundException('Configuration was not found on server');
    }
    return configuration;
  }

  public async create(
    configurationDTO: ConfigurationDTO,
  ): Promise<Configuration> {
    let configuration = await this.configurationRepository.findOne();
    if (configuration) {
      throw new ConflictException('Configuration already exists');
    }
    configuration = new Configuration();
    configuration.center = configurationDTO.center;
    configuration.code = configurationDTO.code;
    configuration.address = configurationDTO.address;
    configuration.city = configurationDTO.city;
    configuration.state = configurationDTO.state;
    configuration.phoneNumber = configurationDTO.phoneNumber;
    configuration.url = configurationDTO.url;
    configuration.email = configurationDTO.email;
    configuration.headMaster = configurationDTO.headMaster;
    return await this.configurationRepository.save(configuration);
  }

  public async setDefaultCourse(courseId: string): Promise<Configuration> {
    const course = await this.coursesRepository.findOne(courseId);
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
    return await this.configurationRepository.save(configuration);
  }
}
