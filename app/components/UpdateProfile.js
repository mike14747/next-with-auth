'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
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

    const [isLoadingUsername, setIsLoadingUsername] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);

    const [isLoadingState, setIsLoadingState] = useState({
        isLoadingUsername: false,
        isLoadingPassword: false,
        isLoadingEmail: false,
    });

    const [showUpdateUsername, setShowUpdateUsername] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [showUpdateEmail, setShowUpdateEmail] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const [showOptionsState, setShowOptionsState] = useState({
        showUpdateUsername: false,
        showUpdatePassword: false,
        showUpdateEmail: false,
        showDeleteAccount: false,
    });

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const [errorState, setErrorState] = useState({
        usernameError: null,
        passwordError: null,
        emailError: null,
        deleteError: null,
    });

    const [emailUpdateMsg, setEmailUpdateMsg] = useState('');

    const [deleteCounter, setDeleteCounter] = useState(0);

    useEffect(() => {
        if (emailUpdateMsg) {
            email.current = '';
            emailForm.current.reset();
        }
    }, [emailUpdateMsg]);

    const handleUpdateUsernameSubmit = async (e) => {
        e.preventDefault();

        setIsLoadingUsername(true);

        const res = await fetch('/api/users/' + user._id + '/change-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setUsernameError('An error occurred sending the data.');
        });

        if (res?.status === 200) {
            username.current = '';
            setUsernameError(null);
            signOut({ callbackUrl: '/' });
        }

        if (!res) {
            setIsLoadingUsername(false);
            setUsernameError('An error occurred. Please try your update again.');
        }

        if (res.status !== 200) {
            setIsLoadingUsername(false);
            res.status === 400 && setUsernameError('An error occurred. New username is not in the proper format.');
            res.status === 401 && setUsernameError('An error occurred. You do not have permission to make this update.');
            res.status === 409 && setUsernameError('An error occurred. The username you submitted is already in use.');
            res.status === 500 && setUsernameError('A server error occurred. Please try your update again.');
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.current !== repeatPassword.current) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setIsLoadingPassword(true);

        const res = await fetch('/api/users/' + user._id + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password: password.current }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setPasswordError('An error occurred sending the data.');
        });

        if (!res) {
            setIsLoadingPassword(false);
            setPasswordError('An error occurred. Please try your update again.');
        }

        if (res?.status === 200) {
            password.current = '';
            repeatPassword.current = '';
            setPasswordError(null);
            signOut({ callbackUrl: '/' });
        }

        if (res?.status !== 200) {
            setIsLoadingPassword(false);
            res?.status === 400 && setPasswordError('An error occurred. New password is not in the proper format.');
            res?.status === 401 && setPasswordError('An error occurred. You do not have permission to make this update.');
            res?.status === 500 && setPasswordError('A server error occurred. Please try your update again.');
        }
    };

    const handleUpdateEmailSubmit = async (e) => {
        e.preventDefault();

        setIsLoadingEmail(true);

        const res = await fetch('/api/users/' + user._id + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email: email.current }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setEmailError('An error occurred sending the data.');
        });

        setIsLoadingEmail(false);

        if (res?.status === 200) {
            setUser(prev => ({
                ...prev,
                email: email.current,
            }));
            setEmailError(null);
            setEmailUpdateMsg('Your email address has been successfully updated.');
        }

        if (!res) setEmailError('An error occurred. Please try your update again.');

        if (res?.status !== 200) {
            if (res?.status !== 200) {
                res?.status === 400 && setEmailError('An error occurred. New email is not in the proper format.');
                res?.status === 401 && setEmailError('An error occurred. You do not have permission to make this update.');
                res?.status === 500 && setEmailError('A server error occurred. Please try your update again.');
                setEmailUpdateMsg('');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
        } else if (deleteCounter > 0) {
            const res = await fetch('/api/users/' + user._id + '/delete-account', {
                method: 'DELETE',
            }).catch(error => {
                console.error(error.name + ': ' + error.message);
                setPasswordError('An error occurred sending the data.');
            });

            if (!res) setDeleteError('An error occurred. Please try your update again.');

            if (res) {
                if (res?.status === 200) {
                    setDeleteCounter(0);
                    setDeleteError(null);
                    signOut({ callbackUrl: '/' });
                }

                res?.status === 400 && setDeleteError('An error occurred. A bad request was made.');
                res?.status === 401 && setDeleteError('An error occurred. You do not have permission to delete this account.');
                res?.status === 500 && setDeleteError('A server error occurred. Please try your update again.');
            }
        }
    };

    return (
        <>
            <div>
                <h3 className={styles.updateButtonsHeading}>Update / Delete your account</h3>
                {showUpdateUsername
                    ? <Button onClick={() => {
                        setShowUpdateUsername(false);
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Username</Button>
                    : <Button onClick={() => {
                        setShowUpdateUsername(true);
                        setShowUpdatePassword(false);
                        setShowUpdateEmail(false);
                        setShowDeleteAccount(false);
                    }} type="button" size="small" variant="text" theme="primary">Update Username</Button>
                }
            </div>

            <div>
                {showUpdatePassword
                    ? <Button onClick={() => {
                        setShowUpdatePassword(false);
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Password</Button>
                    : <Button onClick={() => {
                        setShowUpdateUsername(false);
                        setShowUpdatePassword(true);
                        setShowUpdateEmail(false);
                        setShowDeleteAccount(false);
                    }} type="button" size="small" variant="text" theme="primary">Update Password</Button>
                }
            </div>

            <div>
                {showUpdateEmail
                    ? <Button onClick={() => {
                        setShowUpdateEmail(false);
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Email</Button>
                    : <Button onClick={() => {
                        setShowUpdateUsername(false);
                        setShowUpdatePassword(false);
                        setShowUpdateEmail(true);
                        setEmailUpdateMsg('');
                        setShowDeleteAccount(false);
                    }} type="button" size="small" variant="text" theme="primary">Update Email</Button>
                }
            </div>

            <div>
                {showDeleteAccount
                    ? <Button onClick={() => {
                        setShowDeleteAccount(false);
                    }} type="button" size="small" variant="text" theme="primary">Hide Delete Account</Button>
                    : <Button onClick={() => {
                        setShowUpdateUsername(false);
                        setShowUpdatePassword(false);
                        setShowUpdateEmail(false);
                        setShowDeleteAccount(true);
                        setDeleteCounter(0);
                    }} type="button" size="small" variant="text" theme="primary">Delete Account</Button>
                }
            </div>

            <div className={styles.updateContainer}>
                {showUpdateUsername &&
                    <>
                        <h3 className={styles.updateHeading}>Update your username:</h3>

                        <p className={styles.note}>
                            <strong>Note:</strong> changing your username will log you out.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdateUsernameSubmit}>
                            {isLoadingUsername && <Loading />}

                            {usernameError && <p className={styles.error}>{usernameError}</p>}

                            <FormInputForUsername username={username} />

                            <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                        </form>
                    </>
                }

                {showUpdatePassword &&
                    <>
                        <h3 className={styles.updateHeading}>Update your password:</h3>

                        <p className={styles.note}>
                            <strong>Note:</strong> changing your password will log you out.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                            {isLoadingPassword && <Loading />}

                            {passwordError && <p className={styles.error}>{passwordError}</p>}

                            <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                            <Button type="submit" size="medium" variant="contained" theme="secondary">Apply</Button>
                        </form>
                    </>
                }

                {showUpdateEmail &&
                    <>
                        <h3 className={styles.updateHeading}>Update your email:</h3>

                        {emailUpdateMsg && <p className={styles.success}>{emailUpdateMsg}</p>}

                        <form ref={emailForm} className={styles.updateGroup} onSubmit={handleUpdateEmailSubmit}>
                            {isLoadingEmail && <Loading />}

                            {emailError && <p className={styles.error}>{emailError}</p>}

                            <FormInputForEmail email={email} />

                            <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                        </form>
                    </>
                }

                {showDeleteAccount &&
                    <>
                        <h3 className={styles.deleteHeading}>Delete your account</h3>

                        {deleteError && <p className={styles.error}>{deleteError}</p>}

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
