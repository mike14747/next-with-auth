'use client';

import { FormEvent, useRef, useState } from 'react';
import Button from '../Button';
import FormInputForUsername from '../FormInputForUsername';
import FormInputForEmail from '../FormInputForEmail';
import Loading from '../Loading';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgotPassword() {
    const username = useRef<string>('');
    const email = useRef<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSuccess(false);
        setError('');

        const res = await fetch('/api/users/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current, email: email.current }),
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
                setError('An error occurred. Your username and/or email are not valid.');
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
            <h3>Forgot my Password</h3>
            <p className="text-left">
                Enter the username and email address associated with your account and an email will be sent to you with a link to reset your password.
            </p>

            {isSubmitting && <Loading />}

            {error && <p className="error">{error}</p>}

            {success && <p className="success">An email has been sent to the email address you entered.</p>}

            <form onSubmit={handlePasswordSubmit} className="form">
                <FormInputForUsername username={username} />

                <FormInputForEmail email={email} />

                <Button type="submit">Submit</Button>
            </form>
        </section>
    );
}
