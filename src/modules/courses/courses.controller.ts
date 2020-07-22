import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from '../../entities';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/shared/guards/roles.guard';
import { Roles } from '../../common/shared/decorators/roles.decorator';
import { UserRole } from '../../common/shared/enums/user.roles';
import { CourseDTO } from './dto/course.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  public getAll(): Promise<Course[]> {
    return this.coursesService.getAll();
  }

  @Get(':id')
  public getById(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public create(@Body() courseDTO: CourseDTO): Promise<Course> {
    return this.coursesService.create(courseDTO);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() courseDTO: CourseDTO,
  ): Promise<Course> {
    return this.coursesService.update(id, courseDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  public delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.delete(id);
  }
}
