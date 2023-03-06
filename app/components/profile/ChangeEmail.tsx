'use client';

import { useRef, useState, Dispatch, SetStateAction, FormEvent, RefObject } from 'react';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForEmail from '../FormInputForEmail';
import { UserInfo } from '../../../types';

import styles from '../../../styles/profile.module.css';

export default function ChangeEmail({ id, setUser }: { id: string, setUser: Dispatch<SetStateAction<UserInfo>> }) {
    const email = useRef<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isEmailUpdated, setIsEmailUpdated] = useState<boolean>(false);
    const emailForm = useRef<HTMLFormElement>(null);

    const handleChangeEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsEmailUpdated(false);
        setIsSubmitting(true);

        const res = await fetch('/api/users/' + id + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email: email.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        setIsSubmitting(false);

        switch (res?.status) {
            case undefined:
                setError('An error occurred. Please try your update again.');
                break;
            case 200:
                setUser(prev => ({
                    ...prev,
                    email: email.current,
                }));

                setError('');
                setIsEmailUpdated(true);
                if (emailForm.current) emailForm.current.reset();
                break;
            case 400:
                setError('An error occurred. New email is not in the proper format.');
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
                <h3>Change your email:</h3>
            </div>

            {isEmailUpdated && <p className={styles.success}>Your email address has been successfully updated.</p>}

            <form ref={emailForm as RefObject<HTMLFormElement>} className={styles.updateGroup} onSubmit={handleChangeEmailSubmit}>
                {isSubmitting && <Loading />}

                {error && <p className={styles.error}>{error}</p>}

                <FormInputForEmail email={email} />

                <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
            </form>
        </div>
    );
}
