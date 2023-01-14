import { connectToDatabase } from '../../lib/mongodb';
// import { ObjectId } from 'mongodb';

const getUnprotectedData = async () => {
    const { db } = await connectToDatabase();

    return await db
        .collection('data')
        .find({})
        .project({ _id: 1, name: 1 })
        .toArray();
};

const getProtectedData = async () => {
    const { db } = await connectToDatabase();

    return await db
        .collection('data')
        .find({})
        .project({ _id: 1, name: 1, age: 1 })
        .toArray();
};

const getAdminData = async () => {
    const { db } = await connectToDatabase();

    return await db
        .collection('data')
        .find({})
        .project({ _id: 1, name: 1, age: 1, salary: 1 })
        .toArray();
};

const getSettings = async () => {
    const { db } = await connectToDatabase();

    return await db
        .collection('settings')
        .findOne({ settingsName: 'current' });
};

module.exports = {
    getUnprotectedData,
    getProtectedData,
    getAdminData,
    getSettings,
};
