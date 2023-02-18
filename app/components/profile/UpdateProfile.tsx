'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import UpdateProfileButtons from './UpdateProfileButtons';
import UpdateUsername from './UpdateUsername';
import UpdatePassword from './UpdatePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccount from './DeleteAccount';
import { UserInfo, ViewButtonState } from '../../../types';

import styles from '../../../styles/profile.module.css';

export default function UpdateProfile({ user, setUser }: {user: UserInfo, setUser: Dispatch<SetStateAction<UserInfo>>}) {
    const [viewState, setViewState] = useState<ViewButtonState>({
        showUpdateUsername: false,
        showUpdatePassword: false,
        showUpdateEmail: false,
        showDeleteAccount: false,
    });

    return (
        <section>
            <UpdateProfileButtons viewState={viewState} setViewState={setViewState} />

            <div className={styles.updateContainer}>
                {viewState.showUpdateUsername &&
                    <UpdateUsername
                        id={user.id}
                    />
                }

                {viewState.showUpdatePassword &&
                    <UpdatePassword
                        id={user.id}
                    />
                }

                {viewState.showUpdateEmail &&
                    <UpdateEmail
                        id={user.id}
                        setUser={setUser}
                    />
                }

                {viewState.showDeleteAccount &&
                    <DeleteAccount
                        id={user.id}
                    />
                }
            </div>
        </section>
    );
}
