'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import UpdateProfileButtons from './UpdateProfileButtons';
import UpdateUsername from './UpdateUsername';
import UpdatePassword from './UpdatePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccount from './DeleteAccount';

import styles from '../../../styles/profile.module.css';

export default function UpdateProfile({ user, setUser }) {
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
                        id={user?.id}
                    />
                }

                {viewState.showUpdatePassword &&
                    <UpdatePassword
                        id={user?.id}
                    />
                }

                {viewState.showUpdateEmail &&
                    <UpdateEmail
                        id={user?.id}
                        setUser={setUser}
                    />
                }

                {viewState.showDeleteAccount &&
                    <DeleteAccount
                        id={user?.id}
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
