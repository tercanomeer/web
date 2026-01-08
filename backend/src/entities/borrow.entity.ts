import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('borrows')
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.borrows, { eager: true })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, (book) => book.borrows, { eager: true })
  book: Book;

  @Column()
  bookId: number;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ nullable: true })
  returnDate: Date;
}

