'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Loading from '../shared/Loading';
import FormInputForUsername from '../shared/FormInputForUsername';
import FormInputForNewPassword from '../shared/FormInputForNewPassword';
import FormInputForEmail from '../shared/FormInputForEmail';
import Button from '../shared/Button';

import styles from '../../styles/profile.module.css';

export default function Page() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [profileError, setProfileError] = useState(null);
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

        const res = await fetch('/api/users/' + session.user._id + '/change-username', {
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

        const res = await fetch('/api/users/' + session.user._id + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setEmailError('An error occurred sending the data.');
        });

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

        const res = await fetch('/api/users/' + session.user._id + '/change-password', {
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
            const res = await fetch('/api/users/' + session.user._id + '/delete-account', {
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

    useEffect(() => {
        if (status !== 'authenticated') return;

        const abortController = new AbortController();

        if (session?.user?._id) {
            setIsLoading(true);

            // I'm using plain old promise chaining here since it's inside a useEffect
            // otherwise I'd have to write an async function, then call it to run to set the fetch call to a variable using async/await
            fetch('/api/users/' + session.user._id, { signal: abortController.signal })
                .then(res => {
                    if (!res.ok) throw new Error('An error occurred fetching data.');
                    return res.json();
                })
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        console.error(error.name + ': Data fetching was aborted.');
                    } else {
                        console.error(error.name + ': ' + error.message);
                        setUser(null);
                        setProfileError('An error occurred fetching data.');
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setUser(null);
        }

        return () => abortController.abort();
    }, [status, session, emailUpdateMsg]);

    if (status === 'loading') return <Loading />;

    if (status === 'unauthenticated') router.push('/login?callbackUrl=/profile');

    if (status === 'authenticated') {
        return (
            <>
                <article className="mw-75ch">
                    <h2 className="page-heading">
                        Profile
                    </h2>

                    {isLoading && <Loading />}

                    {profileError && <p className={styles.error}>{profileError}</p>}

                    {user &&
                        <>
                            <div className={styles.currentContainer}>
                                <h3 className={styles.currentHeading}>Current profile information:</h3>

                                <p><span className={styles.description}>Username: </span>{user?.username}</p>

                                <p><span className={styles.description}>Password: </span>************</p>

                                <p><span className={styles.description}>Email: </span>{user?.email}</p>
                            </div>

                            <div className={styles.updateContainer}>
                                <h3 className={styles.updateHeading}>Update your profile information:</h3>

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
                    }
                </article>
            </>
        );
    }

    return null;
}
