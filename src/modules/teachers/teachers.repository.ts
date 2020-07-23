import { EntityRepository, Repository } from 'typeorm';
import { Teacher } from '../../entities';

@EntityRepository(Teacher)
export class TeachersRepository extends Repository<Teacher> {
  public async getByEmployeeNumber(
    idNumber: string,
  ): Promise<Teacher | undefined> {
    return await this.findOne({ dni: idNumber });
  }
}
