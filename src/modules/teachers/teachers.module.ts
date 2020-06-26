import { Module } from '@nestjs/common';
import { Teacher } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  providers: [TeachersService],
  controllers: [],
})
export class TeachersModule {}
