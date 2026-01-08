"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const borrow_entity_1 = require("../entities/borrow.entity");
const book_entity_1 = require("../entities/book.entity");
let BorrowsService = class BorrowsService {
    borrowsRepository;
    booksRepository;
    constructor(borrowsRepository, booksRepository) {
        this.borrowsRepository = borrowsRepository;
        this.booksRepository = booksRepository;
    }
    async create(createBorrowDto) {
        const book = await this.booksRepository.findOne({
            where: { id: createBorrowDto.bookId },
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${createBorrowDto.bookId} not found`);
        }
        const activeBorrows = await this.borrowsRepository.count({
            where: {
                bookId: createBorrowDto.bookId,
                returnDate: (0, typeorm_2.IsNull)(),
            },
        });
        if (activeBorrows >= book.quantity) {
            throw new common_1.BadRequestException('Book is not available for borrowing');
        }
        const existingBorrow = await this.borrowsRepository.findOne({
            where: {
                userId: createBorrowDto.userId,
                bookId: createBorrowDto.bookId,
                returnDate: (0, typeorm_2.IsNull)(),
            },
        });
        if (existingBorrow) {
            throw new common_1.BadRequestException('User has already borrowed this book');
        }
        const borrow = this.borrowsRepository.create(createBorrowDto);
        return this.borrowsRepository.save(borrow);
    }
    async findAll() {
        return this.borrowsRepository.find({
            relations: ['user', 'book', 'book.author', 'book.categories'],
        });
    }
    async findByUser(userId) {
        return this.borrowsRepository.find({
            where: { userId },
            relations: ['user', 'book', 'book.author', 'book.categories'],
        });
    }
    async findByBook(bookId) {
        return this.borrowsRepository.find({
            where: { bookId },
            relations: ['user', 'book', 'book.author', 'book.categories'],
        });
    }
    async findOne(id) {
        const borrow = await this.borrowsRepository.findOne({
            where: { id },
            relations: ['user', 'book', 'book.author', 'book.categories'],
        });
        if (!borrow) {
            throw new common_1.NotFoundException(`Borrow with ID ${id} not found`);
        }
        return borrow;
    }
    async returnBook(id) {
        const borrow = await this.findOne(id);
        if (borrow.returnDate) {
            throw new common_1.BadRequestException('Book has already been returned');
        }
        borrow.returnDate = new Date();
        return this.borrowsRepository.save(borrow);
    }
    async update(id, updateBorrowDto) {
        const borrow = await this.findOne(id);
        Object.assign(borrow, updateBorrowDto);
        return this.borrowsRepository.save(borrow);
    }
    async remove(id) {
        const borrow = await this.findOne(id);
        await this.borrowsRepository.remove(borrow);
    }
};
exports.BorrowsService = BorrowsService;
exports.BorrowsService = BorrowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(borrow_entity_1.Borrow)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BorrowsService);
//# sourceMappingURL=borrows.service.js.map