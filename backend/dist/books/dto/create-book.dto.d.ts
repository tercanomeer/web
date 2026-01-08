export declare class CreateBookDto {
    title: string;
    isbn: string;
    description?: string;
    quantity: number;
    authorId: number;
    categoryIds?: number[];
    imageUrl?: string;
}
