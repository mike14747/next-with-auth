'use client';

import { FormEvent, useRef, useState } from 'react';
import Button from '../Button';
import FormInputForEmail from '../FormInputForEmail';
import Loading from '../Loading';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgotUsername() {
    const email = useRef<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleUsernameSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setIsSubmitting(true);
        setSuccess(false);
        setError('');

        const res = await fetch('/api/users/forgot-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email: email.current }),
        })
            .catch(error => {
                console.log(error.message);
                setError('A network error occurred. Please try your request again.');
            });

        setIsSubmitting(false);

        switch (res?.status) {
            case undefined:
                setError('An error occurred. Please try your request again.');
                break;
            case 200:
                setError('');
                setSuccess(true);
                break;
            case 400:
                setError('An error occurred. Make sure you submitted your email address correctly and try again.');
                break;
            case 500:
                setError('A server error occurred. Please try your request again.');
                break;
            default:
                setError('An unknown error occurred. Please try your request again.');
        }
    };

    return (
        <section className={styles.lower}>
            <h3>Forgot my Username</h3>
            <p className="text-left">
                Enter the email address associated with your account(s) and an email will be sent with the username(s) linked to your email address.
            </p>

            {isSubmitting && <Loading />}

            {error && <p className="error">{error}</p>}

            {success && <p className="success">An email has been sent to the email address you entered.</p>}

            <form onSubmit={handleUsernameSubmit} className="form">
                <FormInputForEmail email={email} />

                <Button type="submit">Submit</Button>
            </form>
        </section>
    );
}
