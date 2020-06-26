import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Group } from '../../../entities';

export class CreateGroupDTO implements Readonly<CreateGroupDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsOptional()
  denomination: string;

  public static from(dto: Partial<CreateGroupDTO>) {
    const it = new CreateGroupDTO();
    it.group = dto.group;
    it.denomination = dto.denomination;
    return it;
  }

  public static fromEntity(entity: Group) {
    return this.from({
      group: entity.group,
      denomination: entity.denomination,
    });
  }

  public toEntity() {
    const it = new Group();
    it.group = this.group;
    it.denomination = this.denomination;
    return it;
  }
}
