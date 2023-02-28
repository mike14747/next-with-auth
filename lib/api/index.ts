import clientPromise from '../../lib/mongodb';
// import { ObjectId } from 'bson';

export const getUnprotectedData = async () => {
    try {
        const connection = await clientPromise;
        const db = connection.db();

        return await db.collection('data')
            .find({})
            .project({ _id: { '$toString': '$_id' }, name: 1 })
            .toArray();
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getProtectedData = async () => {
    try {
        const client = await clientPromise;
        const db = client.db();

        return await db.collection('data')
            .find({})
            .project({ _id: { '$toString': '$_id' }, name: 1, age: 1 })
            .toArray();
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAdminData = async () => {
    try {
        const client = await clientPromise;
        const db = client.db();

        return await db.collection('data')
            .find({})
            .project({ _id: { '$toString': '$_id' }, name: 1, age: 1, salary: 1 })
            .toArray();
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getSettings = async () => {
    try {
        const client = await clientPromise;
        const db = client.db();

        return await db.collection('settings')
            .findOne({ settingsName: 'current' });
    } catch (error) {
        console.log(error);
        return null;
    }
};
