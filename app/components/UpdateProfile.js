'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Loading from './Loading';
import FormInputForUsername from './FormInputForUsername';
import FormInputForNewPassword from './FormInputForNewPassword';
import FormInputForEmail from './FormInputForEmail';
import Button from './Button';

import styles from '../../styles/profile.module.css';

export default function UpdateProfile({ userId }) {
    const [isLoading, setIsLoading] = useState(false);

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const [emailUpdateMsg, setEmailUpdateMsg] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [deleteCounter, setDeleteCounter] = useState(0);

    const handleUpdateUsernameSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/' + userId + '/change-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setUsernameError('An error occurred sending the data.');
        });

        if (res) {
            if (res.status === 200) {
                setUsername('');
                setUsernameError(null);
                signOut({ callbackUrl: '/' });
            }

            res.status === 400 && setUsernameError('An error occurred. New username is not in the proper format.');
            res.status === 401 && setUsernameError('An error occurred. You do not have permission to make this update.');
            res.status === 409 && setUsernameError('An error occurred. The username you submitted is already in use.');
            res.status === 500 && setUsernameError('A server error occurred. Please try your update again.');
        }
    };

    const handleUpdateEmailSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const res = await fetch('/api/users/' + userId + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setEmailError('An error occurred sending the data.');
        });

        setIsLoading(false);

        if (res) {
            if (res.status === 200) {
                setEmail('');
                setEmailError(null);
                setEmailUpdateMsg('Your email address has been successfully updated!');
            }

            if (res.status !== 200) {
                res.status === 400 && setEmailError('An error occurred. New email is not in the proper format.');
                res.status === 401 && setEmailError('An error occurred. You do not have permission to make this update.');
                res.status === 500 && setEmailError('A server error occurred. Please try your update again.');
                setEmailUpdateMsg('');
            }
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/' + userId + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setPasswordError('An error occurred sending the data.');
        });

        if (res) {
            if (res.status === 200) {
                setPassword('');
                setRepeatPassword('');
                setPasswordError(null);
                signOut({ callbackUrl: '/' });
            }

            res.status === 400 && setPasswordError('An error occurred. New password is not in the proper format.');
            res.status === 401 && setPasswordError('An error occurred. You do not have permission to make this update.');
            res.status === 500 && setPasswordError('A server error occurred. Please try your update again.');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
        } else if (deleteCounter > 0) {
            const res = await fetch('/api/users/' + userId + '/delete-account', {
                method: 'DELETE',
            }).catch(error => {
                console.error(error.name + ': ' + error.message);
                setPasswordError('An error occurred sending the data.');
            });

            if (res) {
                if (res.status === 200) {
                    setDeleteCounter(0);
                    setDeleteError(null);
                    signOut({ callbackUrl: '/' });
                }

                res.status === 400 && setDeleteError('An error occurred. A bad request was made.');
                res.status === 401 && setDeleteError('An error occurred. You do not have permission to delete this account.');
                res.status === 500 && setDeleteError('A server error occurred. Please try your update again.');
            }
        }
    };

    return (
        <>
            <div className={styles.updateContainer}>
                <h3 className={styles.updateHeading}>Update your profile information:</h3>

                {isLoading && <Loading />}

                <p className={styles.note}>
                    <strong>Note:</strong> changing your username and/or password will log you out.
                </p>

                <form className={styles.updateGroup} onSubmit={handleUpdateUsernameSubmit}>
                    {usernameError && <p className={styles.error}>{usernameError}</p>}

                    <FormInputForUsername username={username} setUsername={setUsername} />

                    <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                </form>

                <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                    {passwordError && <p className={styles.error}>{passwordError}</p>}

                    <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                    <Button type="submit" size="medium" variant="contained" theme="secondary">Apply</Button>
                </form>

                <form className={styles.updateGroup} onSubmit={handleUpdateEmailSubmit}>
                    {emailError && <p className={styles.error}>{emailError}</p>}

                    {emailUpdateMsg && <p className={styles.success}>{emailUpdateMsg}</p>}

                    <FormInputForEmail email={email} setEmail={setEmail} />

                    <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                </form>
            </div>

            <div className={styles.deleteContainer}>
                <h3 className={styles.deleteHeading}>Delete your account</h3>

                {deleteError && <p className={styles.error}>{deleteError}</p>}

                {deleteCounter > 0 &&
                    <p>
                        Are you sure?
                    </p>
                }

                <Button type="button" size={deleteCounter > 0 ? 'medium' : 'small'} variant="contained" theme="danger" onClick={handleDeleteAccount}>Delete Account</Button>
            </div>
        </>
    );
}

UpdateProfile.propTypes = {
    userId: PropTypes.string,
};
