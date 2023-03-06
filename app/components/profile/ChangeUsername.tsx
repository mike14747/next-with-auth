'use client';

import { useRef, useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForUsername from '../FormInputForUsername';

import styles from '../../../styles/profile.module.css';

export default function ChangeUsername({ id }: { id: string }) {
    const username = useRef<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChangeUsernameSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        const res = await fetch('/api/users/' + id + '/change-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current }),
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
                setError('An error occurred. New username is not in the proper format.');
                break;
            case 401:
                setError('An error occurred. You do not have permission to make this update.');
                break;
            case 404:
                setError('An error occurred. User was not found.');
                break;
            case 409:
                setError('An error occurred. The username you submitted is already in use.');
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
                <h3>Change your username:</h3>

                <p className={styles.note}>
                    <strong>Note:</strong> changing your username will log you out.
                </p>
            </div>

            <form className={styles.updateGroup} onSubmit={handleChangeUsernameSubmit}>
                {isSubmitting && <Loading />}

                {error && <p className={styles.error}>{error}</p>}

                <FormInputForUsername username={username} />

                <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
            </form>
        </div>
    );
}
