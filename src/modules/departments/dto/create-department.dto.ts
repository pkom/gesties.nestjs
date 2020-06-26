import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Department } from '../../../entities';

export class CreateDepartmentDTO implements Readonly<CreateDepartmentDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsOptional()
  denomination: string;

  public static from(dto: Partial<CreateDepartmentDTO>) {
    const it = new CreateDepartmentDTO();
    it.department = dto.department;
    it.denomination = dto.denomination;
    return it;
  }

  public static fromEntity(entity: Department) {
    return this.from({
      department: entity.department,
      denomination: entity.denomination,
    });
  }

  public toEntity() {
    const it = new Department();
    it.department = this.department;
    it.denomination = this.denomination;
    return it;
  }
}
