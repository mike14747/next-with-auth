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
    const emailForm = useRef('');
    const password = useRef('');
    const repeatPassword = useRef('');

    const [loadingState, setLoadingState] = useState({
        isLoadingUsername: false,
        isLoadingPassword: false,
        isLoadingEmail: false,
        isLoadingDelete: false,
    });

    const [viewState, setViewState] = useState({
        showUpdateUsername: false,
        showUpdatePassword: false,
        showUpdateEmail: false,
        showDeleteAccount: false,
    });

    const [errorState, setErrorState] = useState({
        usernameError: null,
        passwordError: null,
        emailError: null,
        deleteError: null,
    });

    const [isEmailUpdated, setIsEmailUpdated] = useState(false);

    const [deleteCounter, setDeleteCounter] = useState(0);

    return (
        <>
            <UpdateProfileButtons viewState={viewState} setViewState={setViewState} setIsEmailUpdated={setIsEmailUpdated} setDeleteCounter={setDeleteCounter} />

            <div className={styles.updateContainer}>
                <UpdateUsername
                    user={user}
                    username={username}
                    viewState={viewState}
                    errorState={errorState}
                    setErrorState={setErrorState}
                    loadingState={loadingState}
                    setLoadingState={setLoadingState}
                />

                <UpdatePassword
                    user={user}
                    password={password}
                    repeatPassword={repeatPassword}
                    viewState={viewState}
                    errorState={errorState}
                    setErrorState={setErrorState}
                    loadingState={loadingState}
                    setLoadingState={setLoadingState}
                />

                <UpdateEmail
                    user={user}
                    setUser={setUser}
                    email={email}
                    emailForm={emailForm}
                    isEmailUpdated={isEmailUpdated}
                    setIsEmailUpdated={setIsEmailUpdated}
                    viewState={viewState}
                    errorState={errorState}
                    setErrorState={setErrorState}
                    loadingState={loadingState}
                    setLoadingState={setLoadingState}
                />

                <DeleteAccount
                    user={user}
                    viewState={viewState}
                    errorState={errorState}
                    setErrorState={setErrorState}
                    deleteCounter={deleteCounter}
                    setDeleteCounter={setDeleteCounter}
                    loadingState={loadingState}
                    setLoadingState={setLoadingState}
                />
            </div>
        </>

    );
}

UpdateProfile.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
};
