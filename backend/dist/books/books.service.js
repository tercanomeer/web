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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("../entities/book.entity");
const category_entity_1 = require("../entities/category.entity");
let BooksService = class BooksService {
    booksRepository;
    categoriesRepository;
    constructor(booksRepository, categoriesRepository) {
        this.booksRepository = booksRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(createBookDto) {
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
                id: (0, typeorm_2.In)(createBookDto.categoryIds),
            });
            book.categories = categories;
        }
        return this.booksRepository.save(book);
    }
    async findAll() {
        return this.booksRepository.find({
            relations: ['author', 'categories'],
        });
    }
    async findOne(id) {
        const book = await this.booksRepository.findOne({
            where: { id },
            relations: ['author', 'categories'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        if (updateBookDto.title)
            book.title = updateBookDto.title;
        if (updateBookDto.isbn)
            book.isbn = updateBookDto.isbn;
        if (updateBookDto.description !== undefined)
            book.description = updateBookDto.description;
        if (updateBookDto.quantity !== undefined)
            book.quantity = updateBookDto.quantity;
        if (updateBookDto.authorId)
            book.authorId = updateBookDto.authorId;
        if (updateBookDto.imageUrl !== undefined)
            book.imageUrl = updateBookDto.imageUrl;
        if (updateBookDto.categoryIds !== undefined) {
            if (updateBookDto.categoryIds.length > 0) {
                const categories = await this.categoriesRepository.findBy({
                    id: (0, typeorm_2.In)(updateBookDto.categoryIds),
                });
                book.categories = categories;
            }
            else {
                book.categories = [];
            }
        }
        return this.booksRepository.save(book);
    }
    async remove(id) {
        const book = await this.findOne(id);
        await this.booksRepository.remove(book);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BooksService);
//# sourceMappingURL=books.service.js.map