'use client';

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import UpdateProfileButtons from './UpdateProfileButtons';
import UpdateUsername from './UpdateUsername';
import UpdatePassword from './UpdatePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccount from './DeleteAccount';

import styles from '../../../styles/profile.module.css';

export default function UpdateProfile({ user, setUser }) {
    const username = useRef('');
    const email = useRef('');
    const password = useRef('');
    const repeatPassword = useRef('');

    const [viewState, setViewState] = useState({
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
                        _id={user?._id}
                        username={username}
                    />
                }

                {viewState.showUpdatePassword &&
                    <UpdatePassword
                        _id={user?._id}
                        password={password}
                        repeatPassword={repeatPassword}
                    />
                }

                {viewState.showUpdateEmail &&
                    <UpdateEmail
                        _id={user?._id}
                        setUser={setUser}
                        email={email}
                    />
                }

                {viewState.showDeleteAccount &&
                    <DeleteAccount
                        _id={user?._id}
                    />
                }
            </div>
        </section>
    );
}

UpdateProfile.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
};
