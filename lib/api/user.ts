import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'bson';
import { mailTransporter } from '../nodemailerConfig';
import { formatDateObject } from '../formatDate';
import { usernamePattern, emailPattern, passwordPattern } from '../formInputPatterns';
import { generateRandom, hashPassword } from '../cryptoUtils';

export const getUserForSignin = async (username: string, password: string) => {
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

export const testEmail = async () => {
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

export const getUserProfile = async (_id: string) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };

    const { db } = await connectToDatabase();

    return await db
        .collection('users')
        .findOne({ _id: new ObjectId(_id) }, { projection: { _id: 0, username: 1, email: 1 } });
};

type UserInfo = {
    username: string;
    email: string;
    role: string;
    active: boolean;
    registeredDate?: Date;
    formattedRegisteredDate: string | null;
}

export const getInfoForAllUsers = async () => {
    const { db } = await connectToDatabase();

    const data = await db
        .collection('users')
        .find()
        .project({ username: 1, email: 1, role: 1, active: 1, registeredDate: 1 })
        .toArray();

    data.forEach((item: UserInfo) => {
        if (item.registeredDate) {
            item.formattedRegisteredDate = formatDateObject(item.registeredDate, 'short');
        } else {
            item.formattedRegisteredDate = null;
        }
        delete item.registeredDate;
    });

    return data;
};

export const checkForAvailableUsername = async (username: string) => {
    const { db } = await connectToDatabase();

    // I could have used a "findOne" in this query, but I wanted to be able to tell the difference between a failed db query and an empty result (null vs empty array when using "find")
    return await db
        .collection('users')
        .find({ username })
        .project({ _id: 1, username: 1 })
        .limit(1)
        .toArray();
};

export const registerNewUser = async (username: string, password: string, email: string) => {
    const pattern1 = new RegExp(usernamePattern);
    if (!username || !pattern1.test(username)) return { code: 400 };

    const pattern2 = new RegExp(passwordPattern);
    if (!password || !pattern2.test(password)) return { code: 400 };

    const pattern3 = new RegExp(emailPattern);
    if (!email || !pattern3.test(email)) return { code: 400 };

    const { db } = await connectToDatabase();

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const salt = generateRandom(32);
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

export const changeUsername = async (_id: string, username: string) => {
    if (!_id || !ObjectId.isValid(_id) || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!username || !pattern.test(username)) return { code: 400 };

    const { db } = await connectToDatabase();

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const updateResult = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(_id) }, { $set: { username } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

export const changePassword = async (_id: string, password: string, resetPasswordToken = null) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };
    const pattern = new RegExp(passwordPattern);
    if (!password || !pattern.test(password)) return { code: 400 };

    const { db } = await connectToDatabase();

    if (resetPasswordToken) {
        // since a reset password token is being passed, get the expiration date/time of the token if it exists in the db
        const tokenValidCheck = await db
            .collection('users')
            .find({ _id: new ObjectId(_id), resetPasswordToken })
            .project({ resetPasswordExpires: 1 })
            .limit(1)
            .toArray();

        // make sure reset password token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    // even if the user is changing their password to the same one they've been using, the salt it's hashed with will be updated, so the modifiedCount will still equal 1... even in that case
    const salt = generateRandom(32);
    const hashedPassword = hashPassword(password, salt);

    const updateResult = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(_id) }, { $set: { password: hashedPassword, salt } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

export const changeEmail = async (_id: string, email: string) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };
    const pattern = new RegExp(emailPattern);
    if (!email || !pattern.test(email)) return { code: 400 };

    const { db } = await connectToDatabase();

    // adding the emailUpdatedAt property will make modifiedCount return 1 even if the updated email address is the same as the old one
    const updateResult = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(_id) }, { $set: { email, emailUpdatedAt: new Date() } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
};

export const forgotUsername = async (email: string) => {
    if (!email) return { code: 400 };

    const { db } = await connectToDatabase();
    const user = await db
        .collection('users')
        .find({ email })
        .project({ username: 1 })
        .toArray();

    if (!user) return { code: 500 }; // query failed
    if (user.length === 0) return { code: 400 }; // email address doesn't match any in the database

    const mailDetails = {
        from: process.env.NO_REPLY_EMAIL,
        to: email,
        subject: 'Forgot Username',
        html: '<p>A request for your username(s) has been made for this email address.</p><p>The username(s) associated with this email address is/are:<br /><br />' + user.map((u: { username: string }) => u.username).join('<br />') + '</p>',
    };

    try {
        const emailSent = await mailTransporter.sendMail(mailDetails);
        return emailSent ? { code: 200 } : { code: 500 };
    } catch (error) {
        console.log(error);
        return { code: 500 };
    }
};

export const resetPassword = async (username: string, email: string, baseUrl: string) => {
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

    const _id = user[0]._id;

    // generate a reset password token
    const resetPasswordToken = generateRandom(20);
    const link = `${baseUrl}/reset-link/${_id.toString()}/${resetPasswordToken}`;

    const mailDetails = {
        from: process.env.NO_REPLY_EMAIL,
        to: email,
        subject: 'Password Reset',
        html: '<p>A password reset request for your username <strong>"' + username + '"</strong> has been made for this email address.</p><p>Click this <a href="' + link + '">link</a> to reset your password. The link will expire in 1 hour.</p><p>If you did not request a password reset, ignore this email.</p>',
    };

    // add the reset password token and expiration date to the user in the db
    const resetPasswordExpires = new Date(Date.now() + (60 * 60 * 1000));
    const updateResult = await db
        .collection('users')
        .updateOne({ _id }, { $set: { resetPasswordToken, resetPasswordExpires } });

    if (updateResult?.modifiedCount !== 1) return { code: 500 };

    try {
        const emailSent = await mailTransporter.sendMail(mailDetails);
        return emailSent ? { code: 200 } : { code: 500 };
    } catch (error) {
        console.log(error);
        return { code: 500 };
    }
};

export const deleteUserAccount = async (_id: string) => {
    if (!_id || !ObjectId.isValid(_id)) return { code: 400 };

    const { db } = await connectToDatabase();

    const deleteResult = await db
        .collection('users')
        .deleteOne({ _id: new ObjectId(_id) });

    return deleteResult?.deletedCount === 1 ? { code: 200 } : { code: 500 };
};
