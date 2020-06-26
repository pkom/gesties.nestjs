import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities';
import { CreateGroupDTO } from './dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  public async getAll(): Promise<CreateGroupDTO[]> {
    return await this.groupsRepository
      .find()
      .then(groups => groups.map(e => CreateGroupDTO.fromEntity(e)));
  }
  public async create(dto: CreateGroupDTO): Promise<CreateGroupDTO> {
    const group = this.groupsRepository.findOne({ group: dto.group });
    if (group) {
      throw new ConflictException(`Group ${dto.group} already exists`);
    }
    return this.groupsRepository
      .save(dto)
      .then(e => CreateGroupDTO.fromEntity(e));
  }
}
