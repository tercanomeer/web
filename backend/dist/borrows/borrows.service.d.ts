import { Repository } from 'typeorm';
import { Borrow } from '../entities/borrow.entity';
import { Book } from '../entities/book.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
export declare class BorrowsService {
    private borrowsRepository;
    private booksRepository;
    constructor(borrowsRepository: Repository<Borrow>, booksRepository: Repository<Book>);
    create(createBorrowDto: CreateBorrowDto): Promise<Borrow>;
    findAll(): Promise<Borrow[]>;
    findByUser(userId: number): Promise<Borrow[]>;
    findByBook(bookId: number): Promise<Borrow[]>;
    findOne(id: number): Promise<Borrow>;
    returnBook(id: number): Promise<Borrow>;
    update(id: number, updateBorrowDto: UpdateBorrowDto): Promise<Borrow>;
    remove(id: number): Promise<void>;
}
