import { Group } from '../../groups/entities/group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column('int')
  stock: number;

  @ManyToOne(() => Group, (g) => g.items)
  @JoinColumn()
  group!: Group | null;
}
