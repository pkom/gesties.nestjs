import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
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
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  state: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  web: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  headMaster: string;
}
