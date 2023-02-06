'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import UpdateProfile from './UpdateProfile';

import styles from '../../../styles/profile.module.css';

type UserInfo = {
    id: string;
    username: string;
    email: string;
}

type UserObjProp = {
    userObj: UserInfo;
}

export default function CurrentProfile({ userObj }: UserObjProp) {
    const [user, setUser] = useState<UserInfo>(userObj);

    return (
        <>
            <div className={styles.currentContainer}>
                <h3 className={styles.currentHeading}>Current profile information:</h3>

                <p><span className={styles.description}>Username: </span>{user.username}</p>

                <p><span className={styles.description}>Password: </span>************</p>

                <p><span className={styles.description}>Email: </span>{user.email}</p>
            </div>

            <UpdateProfile user={user} setUser={setUser} />
        </>
    );
}

CurrentProfile.propTypes = {
    userObj: PropTypes.object,
};
