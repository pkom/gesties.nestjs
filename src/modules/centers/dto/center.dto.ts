import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { Center } from '../../../entities';

export class CenterDTO implements Readonly<CenterDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  denomination: string;

  public static from(dto: Partial<CenterDTO>) {
    const it = new CenterDTO();
    it.id = dto.id;
    it.code = dto.code;
    it.denomination = dto.denomination;
    return it;
  }

  public static fromEntity(entity: Center) {
    return this.from({
      id: entity.id,
      code: entity.code,
      denomination: entity.denomination,
    });
  }

  public toEntity() {
    const it = new Center();
    it.id = this.id;
    it.code = this.code;
    it.denomination = this.denomination;
    return it;
  }
}
