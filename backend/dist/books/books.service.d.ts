import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../entities/category.entity';
export declare class BooksService {
    private booksRepository;
    private categoriesRepository;
    constructor(booksRepository: Repository<Book>, categoriesRepository: Repository<Category>);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    update(id: number, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: number): Promise<void>;
}
