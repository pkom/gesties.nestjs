import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(user: User): Promise<User> {
    const userCreated = await this.usersRepository.findOne({ uid: user.uid });
    if (userCreated) {
      throw new ConflictException(`User ${user.uid} already exists`);
    }
    return await this.usersRepository.save(user).then(e => e);
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ uid: username });
  }
}
