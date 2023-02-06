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

export type UserInfo = {
    id: string;
    username: string;
    email: string;
}

export type UserObjProp = {
    userObj: UserInfo;
}

export type ViewButtonState = {
    showUpdateUsername: boolean;
    showUpdatePassword: boolean;
    showUpdateEmail: boolean;
    showDeleteAccount: boolean;
}
