import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../entities';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesService],
  exports: [TypeOrmModule],
  controllers: [CoursesController],
})
export class CoursesModule {}
