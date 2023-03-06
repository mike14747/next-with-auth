'use client';

import { useRef, useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForNewPassword from '../FormInputForNewPassword';

import styles from '../../../styles/profile.module.css';

export default function ChangePassword({ id }: { id: string }) {
    const password = useRef<string>('');
    const repeatPassword = useRef<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChangePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password.current !== repeatPassword.current) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        const res = await fetch('/api/users/' + id + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password: password.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        if (!res || res.status !== 200) setIsSubmitting(false);

        switch (res?.status) {
            case undefined:
                setError('An error occurred. Please try your update again.');
                break;
            case 200:
                setError('');
                signOut({ callbackUrl: '/' });
                break;
            case 400:
                setError('An error occurred. New password is not in the proper format.');
                break;
            case 401:
                setError('An error occurred. You do not have permission to make this update.');
                break;
            case 404:
                setError('An error occurred. User was not found.');
                break;
            case 500:
                setError('A server error occurred. Please try your update again.');
                break;
            default:
                setError('An unknown error occurred. Please try your update again.');
        }
    };

    return (
        <div className={styles.updateContainer}>
            <div className={styles.updateHeading}>
                <h3>Change your password:</h3>

                <p className={styles.note}>
                    <strong>Note:</strong> changing your password will log you out.
                </p>
            </div>

            <form className={styles.updateGroup} onSubmit={handleChangePasswordSubmit}>
                {isSubmitting && <Loading />}

                {error && <p className={styles.error}>{error}</p>}

                <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                <Button type="submit" size="medium" variant="contained" theme="secondary">Apply</Button>
            </form>
        </div>
    );
}
