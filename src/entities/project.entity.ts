import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true }) // Eliminado el default para evitar problemas en MySQL
  description?: string;

  @ManyToOne(() => User, (user) => user.projects, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Relaciona la clave foránea explícitamente
  user: User;
}
