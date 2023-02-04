import clientPromise from '../../lib/mongodb';
// import { ObjectId } from 'bson';

export const getUnprotectedData = async () => {
    const connection = await clientPromise;
    const db = connection.db();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1 })
        .toArray();
};

export const getProtectedData = async () => {
    const client = await clientPromise;
    const db = client.db();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1, age: 1 })
        .toArray();
};

export const getAdminData = async () => {
    const client = await clientPromise;
    const db = client.db();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1, age: 1, salary: 1 })
        .toArray();

};

export const getSettings = async () => {
    const client = await clientPromise;
    const db = client.db();

    return await db.collection('settings')
        .findOne({ settingsName: 'current' });
};
