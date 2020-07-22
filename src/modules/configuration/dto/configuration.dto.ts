import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsUUID,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class ConfigurationDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  center: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  state?: string;

  @IsOptional()
  @IsPhoneNumber('ES')
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(100)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  headMaster?: string;

  @IsOptional()
  @IsUUID()
  defaultCourse?: string;
}
