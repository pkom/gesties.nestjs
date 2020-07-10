import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { LdapUserDto } from '../auth/dto/ldapUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getOrCreate(userDto: LdapUserDto): Promise<User> {
    let user = await this.usersRepository.findOne({ uid: userDto.uid });
    if (!user) {
      user = await this.usersRepository.save(userDto);
    } else {
      await this.usersRepository.update({ uid: user.uid }, userDto);
    }
    return user;
  }

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
