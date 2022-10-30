import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FormInputForNewPassword from '../../../components/FormInputForNewPassword';
import Button from '../../../components/Button';

import styles from '../../../styles/profile.module.css';

export default function Token() {
    const { data: session } = useSession();

    const router = useRouter();

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [isSuccessfullyUpdated, setIsSuccessfullyUpdated] = useState(false);

    useEffect(() => {
        if (isSuccessfullyUpdated) {
            router.push('/reset-password-success');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessfullyUpdated]);

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/user/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ userId: router.query.userId, token: router.query.token, password }),
        });

        if (res.status !== 200) {
            res.status === 400 && setPasswordError('An error occurred. New password is not in the proper format.');
            res.status === 401 && setPasswordError('An error occurred. You do not have permission to make this update.');
            res.status === 406 && setPasswordError('An error occurred. Reset token does not exist.');
            res.status === 412 && setPasswordError('An error occurred. The reset token has expired.');
            res.status === 500 && setPasswordError('A server error occurred. Please try your update again.');
        }
        if (res.status === 200) {
            setPassword('');
            setRepeatPassword('');
            setPasswordError(null);
            setIsSuccessfullyUpdated(true);
        }
    };

    return (
        <>
            <Head>
                <title>
                    Reset your password
                </title>
            </Head>

            <article className="mw-75ch">
                <h2 className={'page-heading ' + styles.resetPageHeading}>
                    Reset your password
                </h2>

                {session &&
                    <p>
                        You are already logged in, so you cannot reset your password via the reset link. You must do it via your<> </>
                        <Link href="/profile">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a>profile</a>
                        </Link>.
                    </p>
                }

                {!session && !isSuccessfullyUpdated &&
                    <>
                        <p>
                            <strong>Note:</strong> Your password reset link expires 60 minutes after your request was submitted.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                            {passwordError && <p className={styles.error}>{passwordError}</p>}

                            <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                            <Button type="submit" size="medium" variant="contained" style="primary">Apply</Button>
                        </form>
                    </>
                }
            </article>
        </>
    );
}
