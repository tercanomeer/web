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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const book_entity_1 = require("./book.entity");
let Borrow = class Borrow {
    id;
    user;
    userId;
    book;
    bookId;
    borrowDate;
    returnDate;
};
exports.Borrow = Borrow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Borrow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.borrows, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Borrow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Borrow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.Book, (book) => book.borrows, { eager: true }),
    __metadata("design:type", book_entity_1.Book)
], Borrow.prototype, "book", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Borrow.prototype, "bookId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Borrow.prototype, "borrowDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Borrow.prototype, "returnDate", void 0);
exports.Borrow = Borrow = __decorate([
    (0, typeorm_1.Entity)('borrows')
], Borrow);
//# sourceMappingURL=borrow.entity.js.map