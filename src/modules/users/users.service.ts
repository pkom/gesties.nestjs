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

  public async getByName(userName: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(
      { userName },
      { relations: ['roles', 'student', 'teacher'] },
    );
  }

  public async getById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(id, {
      relations: ['roles', 'student', 'teacher'],
    });
  }

  public async create(userDto: UserDto): Promise<User> {
    return await this.usersRepository.save(userDto);
  }

  public async update(id: string, userDto: UserDto): Promise<User> {
    await this.usersRepository.update(id, userDto);
    return await this.getById(id);
  }

  public async save(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return await this.getById(user.id);
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
