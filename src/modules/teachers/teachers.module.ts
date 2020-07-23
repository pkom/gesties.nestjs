import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeachersService } from './teachers.service';
import { TeachersRepository } from './teachers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeachersRepository])],
  providers: [TeachersService],
  exports: [TypeOrmModule],
})
export class TeachersModule {}
