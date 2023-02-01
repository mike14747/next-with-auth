import { connectToDatabase } from '../../lib/mongodb';
// import { ObjectId } from 'bson';

export const getUnprotectedData = async () => {
    const { db } = await connectToDatabase();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1 })
        .toArray();
};

export const getProtectedData = async () => {
    const { db } = await connectToDatabase();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1, age: 1 })
        .toArray();
};

export const getAdminData = async () => {
    const { db } = await connectToDatabase();

    return await db.collection('data')
        .find({})
        .project({ _id: { '$toString': '$_id' }, name: 1, age: 1, salary: 1 })
        .toArray();

};

export const getSettings = async () => {
    const { db } = await connectToDatabase();

    return await db.collection('settings')
        .findOne({ settingsName: 'current' });
};
