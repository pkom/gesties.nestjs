import { Module } from '@nestjs/common';
import { Student } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsService],
  controllers: [],
})
export class StudentsModule {}
