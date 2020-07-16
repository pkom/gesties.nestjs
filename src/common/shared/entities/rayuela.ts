import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class Rayuela {
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  login: string;

  @Exclude()
  @Column({ type: 'int', nullable: true, unique: true })
  id: number;
}
