import { Borrow } from './borrow.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    GUEST = "guest"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    borrows: Borrow[];
    hashPassword(): Promise<void>;
}
