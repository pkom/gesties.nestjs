import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Student } from '../../../entities';

export class CreateStudentDTO implements Readonly<CreateStudentDTO> {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  nie: number;

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

  @IsDate()
  @IsOptional()
  birthDate: Date;

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

  public static from(dto: Partial<CreateStudentDTO>) {
    const it = new CreateStudentDTO();
    it.nie = dto.nie;
    it.firstName = dto.firstName;
    it.middleName = dto.middleName;
    it.lastName = dto.lastName;
    it.birthDate = dto.birthDate;
    it.photoFile = dto.photoFile;
    it.photoBase64 = dto.photoBase64;
    it.rayuelaLogin = dto.rayuelaLogin;
    it.rayuelaId = dto.rayuelaId;
    return it;
  }

  public static fromEntity(entity: Student) {
    return this.from({
      nie: entity.nie,
      firstName: entity.firstName,
      middleName: entity.middleName,
      lastName: entity.lastName,
      birthDate: entity.birthDate,
      photoFile: entity.photoFile,
      photoBase64: entity.photoBase64,
      rayuelaId: entity.rayuela.id,
      rayuelaLogin: entity.rayuela.login,
    });
  }

  public toEntity() {
    const it = new Student();
    it.nie = this.nie;
    it.firstName = this.firstName;
    it.middleName = this.middleName;
    it.lastName = this.lastName;
    it.birthDate = this.birthDate;
    it.photoFile = this.photoFile;
    it.photoBase64 = this.photoBase64;
    it.rayuela.id = this.rayuelaId;
    it.rayuela.login = this.rayuelaLogin;
    return it;
  }
}
