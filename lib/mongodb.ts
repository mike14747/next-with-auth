import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variables in your .env file.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // if (!global._mongoClientPromise) {
    //     client = new MongoClient(uri, options);
    //     global._mongoClientPromise = client.connect();
    // }
    // clientPromise = global._mongoClientPromise;

    const globalWithMongoClientPromise = global as typeof globalThis & {
        _mongoClientPromise: Promise<MongoClient>;
    };

    if (!globalWithMongoClientPromise._mongoClientPromise) {
        client = new MongoClient(uri);
        globalWithMongoClientPromise._mongoClientPromise = client.connect();
    }

    clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
