import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('borrows')
@UseGuards(JwtAuthGuard)
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowsService.create(createBorrowDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('bookId') bookId?: string) {
    if (userId) {
      return this.borrowsService.findByUser(+userId);
    }
    if (bookId) {
      return this.borrowsService.findByBook(+bookId);
    }
    return this.borrowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowsService.findOne(+id);
  }

  @Patch(':id/return')
  returnBook(@Param('id') id: string) {
    return this.borrowsService.returnBook(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowsService.update(+id, updateBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowsService.remove(+id);
  }
}
