import { Module, Global } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../../entities/configuration.entity';
import { CoursesModule } from '../courses/courses.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Configuration]), CoursesModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
