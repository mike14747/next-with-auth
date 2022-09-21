import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { mailTransporter } from '../nodemailerConfig';
import { formatDateObject } from '../formatDate';
import { usernamePattern, emailPattern, passwordPattern } from '../formInputPatterns';

const getUserForSignin = async (username, password) => {
    const { db } = await connectToDatabase();

    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    return await db
        .collection('users')
        .findOne({ username: username, password: hashedPassword }, { projection: { _id: 1, username: 1, role: 1 } });
};

const testEmail = async () => {
    const mailDetails = {
        from: 'nextwithauth.noreply@gmail.com',
        to: 'mike4747@oh.rr.com',
        subject: 'Test email',
        html: '<p>This is a test email.</p>',
    };

    try {
        const emailSent = await mailTransporter.sendMail(mailDetails);
        return emailSent ? { code: 200 } : { code: 500 };
    } catch (error) {
        console.log(error);
        return { code: 500 };
    }
};

const getUnprotectedData = async () => {
    return [
        {
            name: 'Bob',
        },
        {
            name: 'Grace',
        },
    ];
};

const getProtectedData = async () => {
    return [
        {
            name: 'Bob',
            age: 32,
        },
        {
            name: 'Grace',
            age: 25,
        },
    ];
};

const getAdminData = async () => {
    return [
        {
            name: 'Bob',
            age: 32,
            salary: 42000,
        },
        {
            name: 'Grace',
            age: 25,
            salary: 34000,
        },
    ];
};

const getUserProfile = async (_id) => {
    const { db } = await connectToDatabase();

    return await db
        .collection('users')
        .findOne({ _id: ObjectId(_id) }, { projection: { _id: 0, username: 1, email: 1 } });
};

const getInfoForAllUsers = async () => {
    const { db } = await connectToDatabase();

    const data = await db
        .collection('users')
        .find()
        .project({ username: 1, email: 1, role: 1, active: 1, registeredDate: 1 })
        .toArray();

    data.forEach(item => item.registeredDate = formatDateObject(item.registeredDate, 'short'));

    return data;
};

const checkForAvailableUsername = async (username) => {
    const { db } = await connectToDatabase();

    return await db
        .collection('users')
        .find({ username })
        .project({ _id: 1, username: 1 })
        .limit(1)
        .toArray();
};

const registerNewUser = async (username, password, email) => {
    const { db } = await connectToDatabase();
};

const changeUsername = async (_id, username) => {
    const { db } = await connectToDatabase();

    if (!_id || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!pattern.test(username)) return { code: 400 };

    const updateResult = await db
        .collection('users')
        .updateOne({ _id: ObjectId(_id) }, { $set: { username } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

module.exports = {
    getUserForSignin,
    testEmail,
    getUnprotectedData,
    getProtectedData,
    getAdminData,
    getUserProfile,
    getInfoForAllUsers,
    checkForAvailableUsername,
    registerNewUser,
    changeUsername,
};
