import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Course } from '../../../entities';

export class CourseDTO implements Readonly<CourseDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  course: string;

  @IsString()
  @IsOptional()
  denomination: string;

  public static from(dto: Partial<CourseDTO>) {
    const it = new CourseDTO();
    it.course = dto.course;
    it.denomination = dto.denomination;
    return it;
  }

  public static fromEntity(entity: Course) {
    return this.from({
      course: entity.course,
      denomination: entity.denomination,
    });
  }

  public toEntity() {
    const it = new Course();
    it.course = this.course;
    it.denomination = this.denomination;
    return it;
  }
}
