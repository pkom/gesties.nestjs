import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOne(userName: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(
      { userName },
      { relations: ['roles', 'student', 'teacher'] },
    );
  }

  public async create(userDto: UserDto): Promise<User> {
    return await this.usersRepository.save(userDto);
  }

  public async update(userName: string, userDto: UserDto): Promise<User> {
    await this.usersRepository.update({ userName }, userDto);
    return await this.findOne(userName);
  }

  public async save(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }
}
