import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async getByName(userName: string): Promise<User | undefined> {
    return await this.findOne(
      { userName },
      { relations: ['roles', 'student', 'teacher'] },
    );
  }

  public async getById(id: string): Promise<User | undefined> {
    return await this.findOne(id, {
      relations: ['roles', 'student', 'teacher'],
    });
  }
}
