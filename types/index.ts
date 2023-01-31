export interface PublicData {
    _id: string;
    name: string;
}

export interface ProtectedData extends PublicData {
    age: number;
}

export interface AdminData extends ProtectedData {
    salary: number;
}

export interface User {
    _id: string;
    name: string;
    role: 'user' | 'admin';
}

export interface Session {
    user: User;
    expires: Date;
}
export interface token {
    name: string;
    _id: string;
    role: 'user' | 'admin';
    iat: number;
    exp: number;
    jti: string;
}