import { Column, Index } from 'typeorm';
import { IdType } from '../common/shared/enums/id.types';
import { BaseEntity } from './base.entity';

@Index(['idType', 'idNumber'], { unique: true })
@Index(['middleName', 'lastName', 'firstName'])
export abstract class PersonEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: IdType,
    default: IdType.DNI,
  })
  idType: IdType;

  @Column({ type: 'varchar', length: 15, nullable: true })
  idNumber: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  middleName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Index()
  @Column({ type: 'varchar', length: 60, nullable: true })
  email: string;

  @Index()
  @Column({ type: 'varchar', length: 60, nullable: true })
  phone: string;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  address: string;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  @Index()
  zipCode: string;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;
}
