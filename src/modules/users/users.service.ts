import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {
    //   public async create(userDTO: UserDTO): Promise<User> {
    //     return await this.save(userDTO);
    //   }
    //   public async update(id: string, userDTO: UserDTO): Promise<User> {
    //     await this.update(id, userDTO);
    //     return await this.getById(id);
    //   }
    //   public async save(user: User): Promise<User> {
    //     await this.save(user);
    //     return await this.getById(user.id);
    //   }
    //   public async delete(id: string): Promise<void> {
    //     const user = await this.findOne(id);
    //     user.isActive = false;
    //     await this.save(user);
    //   }
  }
}
