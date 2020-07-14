import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Role } from '../../entities';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
