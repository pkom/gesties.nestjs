import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Delete,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CentersService } from './centers.service';
import { CenterDTO } from './dto';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { UserRole } from '../../common/shared/enums/user.roles';
import { RolesGuard } from '../../common/shared/guards/roles.guard';
import { Roles } from '../../common/shared/decorators/roles.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('center')
export class CentersController {
  constructor(private centersService: CentersService) {}

  @Get()
  public async getAll(): Promise<CenterDTO[]> {
    return await this.centersService.getAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public async create(@Body() centerDto: CenterDTO): Promise<CenterDTO> {
    return await this.centersService.create(centerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public async delete(@Param('id') id) {
    return await this.centersService.delete(id);
  }
}
