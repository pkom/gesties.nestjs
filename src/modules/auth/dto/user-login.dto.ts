import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class UserLoginDto {
  @ApiProperty({ description: 'Ldap user name.'})
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Ldap user password.'})
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'Course id.' })
  @IsUUID()
  readonly courseid: string;

}