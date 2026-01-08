import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Borrow } from '../entities/borrow.entity';
import { Book } from '../entities/book.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

@Injectable()
export class BorrowsService {
  constructor(
    @InjectRepository(Borrow)
    private borrowsRepository: Repository<Borrow>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBorrowDto: CreateBorrowDto): Promise<Borrow> {
    // Check if book exists and has available quantity
    const book = await this.booksRepository.findOne({
      where: { id: createBorrowDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${createBorrowDto.bookId} not found`);
    }

    // Check if book is available
    const activeBorrows = await this.borrowsRepository.count({
      where: {
        bookId: createBorrowDto.bookId,
        returnDate: IsNull(),
      },
    });

    if (activeBorrows >= book.quantity) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Check if user already borrowed this book and hasn't returned it
    const existingBorrow = await this.borrowsRepository.findOne({
      where: {
        userId: createBorrowDto.userId,
        bookId: createBorrowDto.bookId,
        returnDate: IsNull(),
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('User has already borrowed this book');
    }

    const borrow = this.borrowsRepository.create(createBorrowDto);
    return this.borrowsRepository.save(borrow);
  }

  async findAll(): Promise<Borrow[]> {
    return this.borrowsRepository.find({
      relations: ['user', 'book', 'book.author', 'book.categories'],
    });
  }

  async findByUser(userId: number): Promise<Borrow[]> {
    return this.borrowsRepository.find({
      where: { userId },
      relations: ['user', 'book', 'book.author', 'book.categories'],
    });
  }

  async findByBook(bookId: number): Promise<Borrow[]> {
    return this.borrowsRepository.find({
      where: { bookId },
      relations: ['user', 'book', 'book.author', 'book.categories'],
    });
  }

  async findOne(id: number): Promise<Borrow> {
    const borrow = await this.borrowsRepository.findOne({
      where: { id },
      relations: ['user', 'book', 'book.author', 'book.categories'],
    });
    if (!borrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }
    return borrow;
  }

  async returnBook(id: number): Promise<Borrow> {
    const borrow = await this.findOne(id);
    
    if (borrow.returnDate) {
      throw new BadRequestException('Book has already been returned');
    }

    borrow.returnDate = new Date();
    return this.borrowsRepository.save(borrow);
  }

  async update(id: number, updateBorrowDto: UpdateBorrowDto): Promise<Borrow> {
    const borrow = await this.findOne(id);
    Object.assign(borrow, updateBorrowDto);
    return this.borrowsRepository.save(borrow);
  }

  async remove(id: number): Promise<void> {
    const borrow = await this.findOne(id);
    await this.borrowsRepository.remove(borrow);
  }
}
