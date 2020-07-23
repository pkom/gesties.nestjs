import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
} from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  uidNumber: string;

  @IsNotEmpty()
  @IsString()
  gidNumber: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  employeeNumber: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsArray()
  groups: string[];

  @IsOptional()
  @IsString()
  password?: string;
}
