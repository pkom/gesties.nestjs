import {
  Get,
  Post,
  ValidationPipe,
  Controller,
  UsePipes,
  Body,
  ParseUUIDPipe,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Configuration } from '../../entities';
import { ConfigurationService } from './configuration.service';
import { ConfigurationDTO } from './dto/configuration.dto';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/shared/guards/roles.guard';
import { Roles } from '../../common/shared/decorators/roles.decorator';
import { UserRole } from '../../common/shared/enums/user.roles';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('configuration')
export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  @Get()
  public get(): Promise<Configuration> {
    return this.configurationService.get();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public async create(
    @Body() configurationDTO: ConfigurationDTO,
  ): Promise<Configuration> {
    return await this.configurationService.create(configurationDTO);
  }

  @Post(':courseId/setdefaultcourse')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public async setDefaultCourse(
    @Param('courseId', ParseUUIDPipe) courseId,
  ): Promise<Configuration> {
    return await this.configurationService.setDefaultCourse(courseId);
  }
}
