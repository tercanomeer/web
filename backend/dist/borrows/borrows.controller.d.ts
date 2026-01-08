import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
export declare class BorrowsController {
    private readonly borrowsService;
    constructor(borrowsService: BorrowsService);
    create(createBorrowDto: CreateBorrowDto): Promise<import("../entities/borrow.entity").Borrow>;
    findAll(userId?: string, bookId?: string): Promise<import("../entities/borrow.entity").Borrow[]>;
    findOne(id: string): Promise<import("../entities/borrow.entity").Borrow>;
    returnBook(id: string): Promise<import("../entities/borrow.entity").Borrow>;
    update(id: string, updateBorrowDto: UpdateBorrowDto): Promise<import("../entities/borrow.entity").Borrow>;
    remove(id: string): Promise<void>;
}
