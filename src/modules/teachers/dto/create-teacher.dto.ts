import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Teacher } from '../../../entities';

export class CreateTeacherDTO implements Readonly<CreateTeacherDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  photoFile: string;

  @IsString()
  @IsOptional()
  photoBase64: string;

  @IsString()
  @IsOptional()
  rayuelaLogin: string;

  @IsNumber()
  @IsOptional()
  rayuelaId: number;

  public static from(dto: Partial<CreateTeacherDTO>) {
    const it = new CreateTeacherDTO();
    it.dni = dto.dni;
    it.firstName = dto.firstName;
    it.middleName = dto.middleName;
    it.lastName = dto.lastName;
    it.photoFile = dto.photoFile;
    it.photoBase64 = dto.photoBase64;
    it.rayuelaLogin = dto.rayuelaLogin;
    it.rayuelaId = dto.rayuelaId;
    return it;
  }

  public static fromEntity(entity: Teacher) {
    return this.from({
      dni: entity.dni,
      firstName: entity.firstName,
      middleName: entity.middleName,
      lastName: entity.lastName,
      photoFile: entity.photoFile,
      photoBase64: entity.photoBase64,
      rayuelaId: entity.rayuela.id,
      rayuelaLogin: entity.rayuela.login,
    });
  }

  public toEntity() {
    const it = new Teacher();
    it.dni = this.dni;
    it.firstName = this.firstName;
    it.middleName = this.middleName;
    it.lastName = this.lastName;
    it.photoFile = this.photoFile;
    it.photoBase64 = this.photoBase64;
    it.rayuela.id = this.rayuelaId;
    it.rayuela.login = this.rayuelaLogin;
    return it;
  }
}
