import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolesRepository])],
  providers: [RolesService],
  exports: [TypeOrmModule],
})
export class RolesModule {}
