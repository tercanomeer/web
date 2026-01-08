import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { Borrow } from './entities/borrow.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'library.db',
      entities: [User, Book, Author, Category, Borrow],
      synchronize: true, // Only for development
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
