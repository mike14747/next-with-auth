import { Document } from 'mongodb';

export interface PublicData {
    _id: string;
    name: string;
}

export interface PublicDataDocument extends PublicData, Document {}

export interface ProtectedData extends PublicData {
    age: number;
}

export interface AdminData extends ProtectedData {
    salary: number;
}

export interface User {
    id: string;
    name: string;
    role: 'user' | 'admin';
}

// export interface Session {
//     user: User;
//     expires: Date;
// }

export interface Token {
    name: string;
    id: string;
    role: 'user' | 'admin';
    iat: number;
    exp: number;
    jti: string;
}
