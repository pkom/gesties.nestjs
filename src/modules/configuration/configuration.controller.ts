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
  Patch,
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
  public create(
    @Body() configurationDTO: ConfigurationDTO,
  ): Promise<Configuration> {
    return this.configurationService.create(configurationDTO);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public update(
    @Body() configurationDTO: ConfigurationDTO,
  ): Promise<Configuration> {
    return this.configurationService.update(configurationDTO);
  }

  @Post(':courseId/setdefaultcourse')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public setDefaultCourse(
    @Param('courseId', ParseUUIDPipe) courseId,
  ): Promise<Configuration> {
    return this.configurationService.setDefaultCourse(courseId);
  }
}
