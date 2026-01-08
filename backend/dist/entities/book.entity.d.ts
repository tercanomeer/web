import { Author } from './author.entity';
import { Category } from './category.entity';
import { Borrow } from './borrow.entity';
export declare class Book {
    id: number;
    title: string;
    isbn: string;
    description: string;
    quantity: number;
    imageUrl: string;
    author: Author;
    authorId: number;
    categories: Category[];
    borrows: Borrow[];
}
