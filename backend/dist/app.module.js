"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const books_module_1 = require("./books/books.module");
const authors_module_1 = require("./authors/authors.module");
const categories_module_1 = require("./categories/categories.module");
const borrows_module_1 = require("./borrows/borrows.module");
const user_entity_1 = require("./entities/user.entity");
const book_entity_1 = require("./entities/book.entity");
const author_entity_1 = require("./entities/author.entity");
const category_entity_1 = require("./entities/category.entity");
const borrow_entity_1 = require("./entities/borrow.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'library.db',
                entities: [user_entity_1.User, book_entity_1.Book, author_entity_1.Author, category_entity_1.Category, borrow_entity_1.Borrow],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            books_module_1.BooksModule,
            authors_module_1.AuthorsModule,
            categories_module_1.CategoriesModule,
            borrows_module_1.BorrowsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map