import { User } from './user.entity';
import { Book } from './book.entity';
export declare class Borrow {
    id: number;
    user: User;
    userId: number;
    book: Book;
    bookId: number;
    borrowDate: Date;
    returnDate: Date;
}
