import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';
import { Borrow } from './borrow.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  author: Author;

  @Column()
  authorId: number;

  @ManyToMany(() => Category, (category) => category.books, { eager: true })
  @JoinTable({
    name: 'book_categories',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];
}

