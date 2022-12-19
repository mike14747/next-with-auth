import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { mailTransporter } from '../nodemailerConfig';
import { formatDateObject } from '../formatDate';
import { usernamePattern, emailPattern, passwordPattern } from '../formInputPatterns';

const hashPassword = (password, salt) => {
    if (!password || !salt) return null;
    return pbkdf2Sync(password, salt, 10000, 128, 'sha512').toString('hex');
};

const getUserForSignin = async (username, password) => {
    const { db } = await connectToDatabase();

    const user = await db
        .collection('users')
        .findOne({ username: username }, { projection: { _id: 1, username: 1, password: 1, salt: 1, role: 1 } });
    if (!user) return null;

    const hashedPassword = hashPassword(password, user?.salt);
    if (!hashedPassword) return null;

    if (hashedPassword === user.password) {
        return {
            _id: user._id.toString(),
            username: user.username,
            role: user.role,
        };
    } else {
        return null;
    }
};

const testEmail = async () => {
    const mailDetails = {
        from: 'nextwithauth.noreply@gmail.com',
        to: process.env.TEST_EMAIL,
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
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };

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

const checkForAvailableUsername = async (db, username) => {
    // I could have used a "findOne" in this query, but I wanted to be able to tell the difference between a failed db query and an empty result (null vs empty array when using "find")
    return await db
        .collection('users')
        .find({ username })
        .project({ _id: 1, username: 1 })
        .limit(1)
        .toArray();
};

const registerNewUser = async (username, password, email) => {
    const pattern1 = new RegExp(usernamePattern);
    if (!username || !pattern1.test(username)) return { code: 400 };

    const pattern2 = new RegExp(passwordPattern);
    if (!password || !pattern2.test(password)) return { code: 400 };

    const pattern3 = new RegExp(emailPattern);
    if (!email || !pattern3.test(email)) return { code: 400 };

    const { db } = await connectToDatabase();

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(db, username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = hashPassword(password, salt);
    if (!hashedPassword) return null;

    const newUser = {
        username,
        password: hashedPassword,
        salt,
        email,
        role: 'user',
        active: true,
        registeredDate: new Date(Date.now()),
    };

    const result = await db
        .collection('users')
        .insertOne(newUser);

    return result?.insertedId ? { code: 201 } : { code: 500 };
};

const changeUsername = async (_id, username) => {
    if (!_id || !ObjectId.isValid(_id) || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!username || !pattern.test(username)) return { code: 400 };

    const { db } = await connectToDatabase();

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(db, username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const updateResult = await db
        .collection('users')
        .updateOne({ _id: ObjectId(_id) }, { $set: { username } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

const changePassword = async (_id, password, token = null) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };
    const pattern = new RegExp(passwordPattern);
    if (!password || !pattern.test(password)) return { code: 400 };

    const { db } = await connectToDatabase();

    if (token) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const tokenValidCheck = await db
            .collection('users')
            .find({ _id: ObjectId(_id), resetPasswordToken: token })
            .project({ resetPasswordExpires: 1 })
            .limit(1)
            .toArray();

        // make sure token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    // even if the user is changing their password to the same one they've been using, the salt it's hashed with will be updated, so the modifiedCount will still equal 1... even in that case
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const updateResult = await db
        .collection('users')
        .updateOne({ _id: ObjectId(_id) }, { $set: { password: hashedPassword, salt } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

const changeEmail = async (_id, email) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };
    const pattern = new RegExp(emailPattern);
    if (!email || !pattern.test(email)) return { code: 400 };

    const { db } = await connectToDatabase();

    // adding the emailUpdatedAt property will make modifiedCount return 1 even if the updated email address is the same as the old one
    const updateResult = await db
        .collection('users')
        .updateOne({ _id: ObjectId(_id) }, { $set: { email, emailUpdatedAt: new Date() } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

const forgotUsername = async (email) => {
    if (!email) return { code: 400 };

    const { db } = await connectToDatabase();
    const user = await db
        .collection('users')
        .find({ email })
        .project({ username: 1 })
        .toArray();

    if (!user) return { code: 500 }; // query failed
    if (user.length === 0) return { code: 400 }; // email address doesn't match any in the database

    if (user.length > 0) {
        const mailDetails = {
            from: process.env.NO_REPLY_EMAIL,
            to: email,
            subject: 'Forgot Username',
            html: '<p>A request for your username(s) has been made for this email address.</p><p>The username(s) associated with this email address is/are:<br /><br />' + user.map(u => u.username).join('<br />') + '</p>',
        };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    }
};

const resetPassword = async (username, email, baseUrl) => {
    if (!username || !email || !baseUrl) return { code: 400 };

    const { db } = await connectToDatabase();

    // get the user by username and email
    const user = await db
        .collection('users')
        .find({ username, email })
        .project({ _id: 1 })
        .limit(1)
        .toArray();

    if (!user) return { code: 500 }; // query failed
    if (user.length === 0) return { code: 400 }; // username/email combo doesn't match any in the database

    if (user.length === 1) {
        const _id = user[0]._id;

        // generate a reset token
        const token = randomBytes(20).toString('hex');
        const link = `${baseUrl}/reset-link/${_id.toString()}/${token}`;

        const mailDetails = {
            from: process.env.NO_REPLY_EMAIL,
            to: email,
            subject: 'Password Reset',
            html: '<p>A password reset request for your username <strong>"' + username + '"</strong> has been made for this email address.</p><p>Click this <a href="' + link + '">link</a> to reset your password. The link will expire in 1 hour.</p><p>If you did not request a password reset, ignore this email.</p>',
        };

        // add the reset token and expiration date to the user in the db
        const expiresDate = new Date(Date.now() + (60 * 60 * 1000));
        const updateResult = await db
            .collection('users')
            .updateOne({ _id }, { $set: { resetPasswordToken: token, resetPasswordExpires: expiresDate } });

        if (updateResult?.modifiedCount !== 1) return { code: 500 };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    }
};

const deleteUserAccount = async (_id) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };

    const { db } = await connectToDatabase();

    const deleteResult = await db
        .collection('users')
        .deleteOne({ _id: ObjectId(_id) });

    return deleteResult?.deletedCount === 1 ? { code: 200 } : { code: 500 };
};

module.exports = {
    getUserForSignin,
    testEmail,
    getUserProfile,
    getInfoForAllUsers,
    registerNewUser,
    changeUsername,
    changePassword,
    changeEmail,
    forgotUsername,
    resetPassword,
    deleteUserAccount,
};
