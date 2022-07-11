import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';
import FormInputForUsername from '../components/FormInputForUsername';
import FormInputForNewPassword from '../components/FormInputForNewPassword';
import FormInputForEmail from '../components/FormInputForEmail';
import Button from '../components/Button';

import styles from '../styles/profile.module.css';

const Profile = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [profileError, setProfileError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const [emailUpdateMsg, setEmailUpdateMsg] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleUpdateUsernameSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/' + session.user.id + '/update-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username }),
        });

        if (res.status !== 200) {
            res.status === 400 && setUsernameError('An error occurred. New username is not in the proper format.');
            res.status === 401 && setUsernameError('An error occurred. You do not have permission to make this update.');
            res.status === 409 && setUsernameError('An error occurred. The username you submitted is already in use.');
            res.status === 500 && setUsernameError('A server error occurred. Please try your update again.');
        }

        if (res.status === 200) {
            signOut({ redirect: false });
            setUsername('');
            setUsernameError(null);
        }
    };

    const handleUpdateEmailSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/' + session.user.id + '/update-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email }),
        });

        if (res.status !== 200) {
            res.status === 400 && setEmailError('An error occurred. New email is not in the proper format.');
            res.status === 401 && setEmailError('An error occurred. You do not have permission to make this update.');
            res.status === 500 && setEmailError('A server error occurred. Please try your update again.');
            setEmailUpdateMsg('');
        }
        if (res.status === 200) {
            setEmail('');
            setEmailError(null);
            setEmailUpdateMsg('Your email address has been successfully updated to: ' + email + '!');
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/' + session.user.id + '/update-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password }),
        });

        if (res.status !== 200) {
            res.status === 400 && setPasswordError('An error occurred. New password is not in the proper format.');
            res.status === 401 && setPasswordError('An error occurred. You do not have permission to make this update.');
            res.status === 500 && setPasswordError('A server error occurred. Please try your update again.');
        }
        if (res.status === 200) {
            signOut({ redirect: false });
            setPassword('');
            setRepeatPassword('');
            setPasswordError(null);
        }
    };

    useEffect(() => {
        if (session) {
            setIsLoading(true);
            const fetchData = async () => {
                const data = await fetch('/api/users/' + session.user.id)
                    .then(res => res.json())
                    .catch(error => console.error(error));
                if (data?.length === 1) {
                    setUser(data[0]);
                } else {
                    setUser(null);
                    setProfileError('An error occurred fetching data.');
                }
                setIsLoading(false);
            };
            fetchData();
        } else {
            setUser(null);
        }
    }, [session, emailUpdateMsg]);

    if (loading) return <Loading />;

    if (!session) router.push('/login?url=/profile');

    if (session) {
        return (
            <>
                <Head>
                    <title>
                        Biking Log - Profile
                    </title>
                </Head>

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

                                <p className={styles.profileItem}><span className={styles.description}>Username: </span>{user?.username}</p>

                                <p className={styles.profileItem}><span className={styles.description}>Password: </span>not visible for security reasons</p>

                                <p className={styles.profileItem}><span className={styles.description}>Email: </span>{user?.email}</p>
                            </div>

                            <h3 className={styles.updateHeading}>Update your profile information:</h3>

                            <p className={styles.note}>
                                <strong>Note:</strong> changing your username and/or password will log you out.
                            </p>

                            <form className={styles.updateGroup} onSubmit={handleUpdateUsernameSubmit}>
                                {usernameError && <p className={styles.error}>{usernameError}</p>}

                                <FormInputForUsername username={username} setUsername={setUsername} />

                                <Button type="submit" size="medium" variant="contained" style="primary">Apply</Button>
                            </form>

                            <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                                {passwordError && <p className={styles.error}>{passwordError}</p>}

                                <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                                <Button type="submit" size="medium" variant="contained" style="primary">Apply</Button>
                            </form>

                            <form className={styles.updateGroup} onSubmit={handleUpdateEmailSubmit}>
                                {emailError && <p className={styles.error}>{emailError}</p>}

                                {emailUpdateMsg && <p className={styles.success}>{emailUpdateMsg}</p>}

                                <FormInputForEmail email={email} setEmail={setEmail} />

                                <Button type="submit" size="medium" variant="contained" style="primary">Apply</Button>
                            </form>
                        </>
                    }
                </article>
            </>
        );
    }

    return null;
};

export default Profile;
