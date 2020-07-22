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
  ParseUUIDPipe,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CentersService } from './centers.service';
import { CenterDTO } from './dto';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { UserRole } from '../../common/shared/enums/user.roles';
import { RolesGuard } from '../../common/shared/guards/roles.guard';
import { Roles } from '../../common/shared/decorators/roles.decorator';
import { Center } from '../../entities';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('center')
export class CentersController {
  constructor(private centersService: CentersService) {}

  @Get()
  public getAll(): Promise<Center[]> {
    return this.centersService.getAll();
  }

  @Get(':id')
  public getById(@Param('id', ParseUUIDPipe) id: string): Promise<Center> {
    return this.centersService.getById(id);
  }

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMINISTRATOR)
  public async create(@Body() centerDto: CenterDTO): Promise<Center> {
    return await this.centersService.create(centerDto);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMINISTRATOR)
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() centerDTO: CenterDTO,
  ): Promise<Center> {
    return this.centersService.update(id, centerDTO);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMINISTRATOR)
  public async delete(@Param('id') id: string) {
    const { affected } = await this.centersService.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Center ${id} does not exist`);
    }
  }
}
