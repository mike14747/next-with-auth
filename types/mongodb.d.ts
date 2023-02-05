import { MongoClient, Document } from 'mongodb';

declare global {
    const _mongoClientPromise: Promise<MongoClient>;
}

export interface PublicDataDocument extends PublicData, Document { }

export interface UserInfo {
    username?: string;
    email?: string;
    id?: string;
    code?: number;
}
