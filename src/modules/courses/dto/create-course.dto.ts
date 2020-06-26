import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Course } from '../../../entities';

export class CreateCourseDTO implements Readonly<CreateCourseDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  course: string;

  @IsString()
  @IsOptional()
  denomination: string;

  public static from(dto: Partial<CreateCourseDTO>) {
    const it = new CreateCourseDTO();
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
