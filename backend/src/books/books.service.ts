import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create({
      title: createBookDto.title,
      isbn: createBookDto.isbn,
      description: createBookDto.description,
      quantity: createBookDto.quantity,
      authorId: createBookDto.authorId,
      imageUrl: createBookDto.imageUrl,
    });

    if (createBookDto.categoryIds && createBookDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findBy({
        id: In(createBookDto.categoryIds),
      });
      book.categories = categories;
    }

    return this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      relations: ['author', 'categories'],
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (updateBookDto.title) book.title = updateBookDto.title;
    if (updateBookDto.isbn) book.isbn = updateBookDto.isbn;
    if (updateBookDto.description !== undefined)
      book.description = updateBookDto.description;
    if (updateBookDto.quantity !== undefined)
      book.quantity = updateBookDto.quantity;
    if (updateBookDto.authorId) book.authorId = updateBookDto.authorId;
    if (updateBookDto.imageUrl !== undefined) book.imageUrl = updateBookDto.imageUrl;

    if (updateBookDto.categoryIds !== undefined) {
      if (updateBookDto.categoryIds.length > 0) {
        const categories = await this.categoriesRepository.findBy({
          id: In(updateBookDto.categoryIds),
        });
        book.categories = categories;
      } else {
        book.categories = [];
      }
    }

    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }
}

