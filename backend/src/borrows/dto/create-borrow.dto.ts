import { IsNumber } from 'class-validator';

export class CreateBorrowDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  userId: number;
}
