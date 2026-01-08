import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { Borrow } from '../entities/borrow.entity';
import { Book } from '../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, Book])],
  controllers: [BorrowsController],
  providers: [BorrowsService],
  exports: [BorrowsService],
})
export class BorrowsModule {}
