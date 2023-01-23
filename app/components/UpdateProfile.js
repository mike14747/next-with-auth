'use client';

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import Loading from './Loading';
import FormInputForUsername from './FormInputForUsername';
import FormInputForNewPassword from './FormInputForNewPassword';
import FormInputForEmail from './FormInputForEmail';
import Button from './Button';

import styles from '../../styles/profile.module.css';

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

    const handleUpdateUsernameSubmit = async (e) => {
        e.preventDefault();

        setLoadingState(prev => ({ ...prev, isLoadingUsername: true }));

        const res = await fetch('/api/users/' + user._id + '/change-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingUsername: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setErrorState(prev => ({ ...prev, usernameError: null }));
                signOut({ callbackUrl: '/' });
                break;
            case 400:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. New username is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 409:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. The username you submitted is already in use.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, usernameError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, usernameError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.current !== repeatPassword.current) {
            setErrorState(prev => ({ ...prev, passwordError: 'Passwords do not match.' }));
            return;
        }

        setLoadingState(prev => ({ ...prev, isLoadingPassword: true }));

        const res = await fetch('/api/users/' + user._id + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password: password.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingPassword: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setErrorState(prev => ({ ...prev, passwordError: null }));
                signOut({ callbackUrl: '/' });
                break;
            case 400:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. New password is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, passwordError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, passwordError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    const handleUpdateEmailSubmit = async (e) => {
        e.preventDefault();

        setIsEmailUpdated(false);
        setLoadingState(prev => ({ ...prev, isLoadingEmail: true }));

        const res = await fetch('/api/users/' + user._id + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email: email.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        setLoadingState(prev => ({ ...prev, isLoadingEmail: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setUser(prev => ({
                    ...prev,
                    email: email.current,
                }));

                setErrorState(prev => ({ ...prev, emailError: null }));
                setIsEmailUpdated(true);
                emailForm.current.reset();
                break;
            case 400:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. New email is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, emailError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, emailError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
            return;
        }

        if (deleteCounter > 0) {
            setLoadingState(prev => ({ ...prev, isLoadingDelete: true }));

            const res = await fetch('/api/users/' + user._id + '/delete-account', {
                method: 'DELETE',
            }).catch(error => console.error(error.name + ': ' + error.message));

            if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingDelete: false }));

            switch (res?.status) {
                case undefined:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. Please try again.' }));
                    break;
                case 200:
                    setErrorState(prev => ({ ...prev, deleteError: null }));
                    signOut({ callbackUrl: '/' });
                    break;
                case 400:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. A bad request was made.' }));
                    break;
                case 401:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. You do not have permission to delete this account.' }));
                    break;
                case 500:
                    setErrorState(prev => ({ ...prev, deleteError: 'A server error occurred. Please try again.' }));
                    break;
                default:
                    setErrorState(prev => ({ ...prev, deleteError: 'An unknown error occurred. Please try again.' }));
            }
        }
    };

    return (
        <>
            <div>
                <h3 className={styles.updateButtonsHeading}>Update / Delete your account</h3>
                {viewState.showUpdateUsername
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdateUsername: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Username</Button>
                    : <Button onClick={() => {
                        setViewState(() => ({
                            showUpdateUsername: true,
                            showUpdatePassword: false,
                            showUpdateEmail: false,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Username</Button>
                }
            </div>

            <div>
                {viewState.showUpdatePassword
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdatePassword: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Password</Button>
                    : <Button onClick={() => {
                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: true,
                            showUpdateEmail: false,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Password</Button>
                }
            </div>

            <div>
                {viewState.showUpdateEmail
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdateEmail: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Email</Button>
                    : <Button onClick={() => {
                        setIsEmailUpdated(false);

                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: false,
                            showUpdateEmail: true,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Email</Button>
                }
            </div>

            <div>
                {viewState.showDeleteAccount
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showDeleteAccount: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Delete Account</Button>
                    : <Button onClick={() => {
                        setDeleteCounter(0);

                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: false,
                            showUpdateEmail: false,
                            showDeleteAccount: true,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Delete Account</Button>
                }
            </div>

            <div className={styles.updateContainer}>
                {viewState.showUpdateUsername &&
                    <>
                        <h3 className={styles.updateHeading}>Update your username:</h3>

                        <p className={styles.note}>
                            <strong>Note:</strong> changing your username will log you out.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdateUsernameSubmit}>
                            {loadingState.isLoadingUsername && <Loading />}

                            {errorState.usernameError && <p className={styles.error}>{errorState.usernameError}</p>}

                            <FormInputForUsername username={username} />

                            <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                        </form>
                    </>
                }

                {viewState.showUpdatePassword &&
                    <>
                        <h3 className={styles.updateHeading}>Update your password:</h3>

                        <p className={styles.note}>
                            <strong>Note:</strong> changing your password will log you out.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                            {loadingState.isLoadingPassword && <Loading />}

                            {errorState.passwordError && <p className={styles.error}>{errorState.passwordError}</p>}

                            <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                            <Button type="submit" size="medium" variant="contained" theme="secondary">Apply</Button>
                        </form>
                    </>
                }

                {viewState.showUpdateEmail &&
                    <>
                        <h3 className={styles.updateHeading}>Update your email:</h3>

                        {isEmailUpdated && <p className={styles.success}>Your email address has been successfully updated.</p>}

                        <form ref={emailForm} className={styles.updateGroup} onSubmit={handleUpdateEmailSubmit}>
                            {loadingState.isLoadingEmail && <Loading />}

                            {errorState.emailError && <p className={styles.error}>{errorState.emailError}</p>}

                            <FormInputForEmail email={email} />

                            <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                        </form>
                    </>
                }

                {viewState.showDeleteAccount &&
                    <>
                        <h3 className={styles.deleteHeading}>Delete your account</h3>

                        {loadingState.isLoadingDelete && <Loading />}

                        {errorState.deleteError && <p className={styles.error}>{errorState.deleteError}</p>}

                        {deleteCounter > 0 &&
                            <p>
                                Are you sure?
                            </p>
                        }

                        <Button type="button" size={deleteCounter > 0 ? 'medium' : 'small'} variant="contained" theme="danger" onClick={handleDeleteAccount}>Delete Account</Button>
                    </>
                }
            </div>
        </>

    );
}

UpdateProfile.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
};
