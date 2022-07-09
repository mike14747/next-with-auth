import { connectToDatabase } from '../../lib/mongodb';

const getUserForSignin = async (username, password) => {
    const { db } = await connectToDatabase();

    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    return await db
        .collection('users')
        .findOne({ username: username, password: hashedPassword }, { projection: { _id: 1, username: 1, role: 1 } });
};

module.exports = {
    getUserForSignin,
};
