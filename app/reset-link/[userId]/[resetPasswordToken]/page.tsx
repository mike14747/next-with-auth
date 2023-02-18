'use client';

import PropTypes from 'prop-types';
import { useRef, useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FormInputForNewPassword from '../../../components/FormInputForNewPassword';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';

import styles from '../../../../styles/profile.module.css';

type PageProps = {
    params: {
        userId: string;
        resetPasswordToken: string;
    }
}

export default function ResetLink({ params }: PageProps) {
    const { data: session } = useSession();

    const router = useRouter();

    const password = useRef<string>('');
    const repeatPassword = useRef<string>('');

    const [passwordError, setPasswordError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccessfullyUpdated, setIsSuccessfullyUpdated] = useState<boolean>(false);

    useEffect(() => {
        if (isSuccessfullyUpdated) {
            router.push('/reset-password-success');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessfullyUpdated]);

    const handleUpdatePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        if (password.current !== repeatPassword.current) {
            setPasswordError('Passwords do not match.');
            return;
        }

        const res = await fetch('/api/users/' + params.userId + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ userId: params.userId, resetPasswordToken: params.resetPasswordToken, password: password.current }),
        });

        if (res.status !== 200) {
            setIsLoading(false);
            res.status === 400 && setPasswordError('An error occurred. New password is not in the proper format.');
            res.status === 401 && setPasswordError('An error occurred. You do not have permission to make this update.');
            res.status === 406 && setPasswordError('An error occurred. User or reset password token do not exist.');
            res.status === 412 && setPasswordError('An error occurred. The reset password token has expired.');
            res.status === 500 && setPasswordError('A server error occurred. Please try your update again.');
        }

        if (res.status === 200) {
            password.current = '';
            repeatPassword.current = '';
            setPasswordError('');
            setIsSuccessfullyUpdated(true);
        }
    };

    return (
        <main id="main">
            <article className="mw-75ch">
                <h2 className={'page-heading ' + styles.resetPageHeading}>
                    Reset your password
                </h2>

                {session &&
                    <p>
                        You are already logged in, so you cannot reset your password via the reset link. You must do it via your<> </>
                        <Link href="/profile">
                            profile
                        </Link>.
                    </p>
                }

                {isLoading && <Loading />}

                {!session && !isSuccessfullyUpdated &&
                    <>
                        <p>
                            <strong>Note:</strong> Your password reset link expires 60 minutes after your request was submitted.
                        </p>

                        <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                            {passwordError && <p className={styles.error}>{passwordError}</p>}

                            <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                            <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                        </form>
                    </>
                }
            </article>
        </main>
    );
}

ResetLink.propTypes = {
    params: PropTypes.object,
};
