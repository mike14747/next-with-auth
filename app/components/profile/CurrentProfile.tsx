'use client';

import { useState } from 'react';
import UpdateProfile from './UpdateProfile';
import { UserInfo, UserObjProp } from '../../../types';

import styles from '../../../styles/profile.module.css';

export default function CurrentProfile({ userObj }: UserObjProp) {
    const [user, setUser] = useState<UserInfo>(userObj);

    return (
        <>
            <div className={styles.currentContainer}>
                <div className={styles.currentHeading}>
                    <h3>Current profile information:</h3>
                </div>

                <p><span className={styles.description}>Username: </span>{user.username}</p>

                <p><span className={styles.description}>Password: </span>************</p>

                <p><span className={styles.description}>Email: </span>{user.email}</p>
            </div>

            <UpdateProfile user={user} setUser={setUser} />
        </>
    );
}
