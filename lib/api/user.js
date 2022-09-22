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
    // const { db } = await connectToDatabase();

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    return true;
};

const changeUsername = async (_id, username) => {
    if (!_id || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!pattern.test(username)) return { code: 400 };

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const { db } = await connectToDatabase();

    const updateResult = await db
        .collection('users')
        .updateOne({ _id: ObjectId(_id) }, { $set: { username } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

const changePassword = async (_id, password, token = null) => {
    if (!_id) return { code: 401 };
    const pattern = new RegExp(passwordPattern);
    if (!password || !pattern.test(password)) return { code: 400 };

    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    const { db } = await connectToDatabase();

    if (token) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const tokenValidCheck = await db
            .collection('users')
            .find({ _id: _id, resetPasswordToken: token })
            .project({ resetPasswordExpires: 1 })
            .limit(1)
            .toArray();

        // make sure token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    const updateResult = await db
        .collection('users')
        .updateOne({ _id: _id }, { $set: { password: hashedPassword } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

const changeEmail = async (_id, email) => {
    if (!_id) return { code: 401 };
    const pattern = new RegExp(emailPattern);
    if (!email || !pattern.test(email)) return { code: 400 };

    const { db } = await connectToDatabase();
    const updateResult = await db
        .collection('users')
        .updateOne({ _id: _id }, { $set: { email: email } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

// forgottenUsername

module.exports = {
    getUserForSignin,
    testEmail,
    getUserProfile,
    getInfoForAllUsers,
    registerNewUser,
    changeUsername,
    changePassword,
    changeEmail,
};
