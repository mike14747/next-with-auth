'use client';

import { useRef, useState } from 'react';
import ForgotLoginButtons from './ForgotLoginButtons';
import ForgotUsername from './ForgotUsername';
import ForgotPassword from './ForgotPassword';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgottenUsername() {
    const username = useRef('');
    const email = useRef('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showForgotUsername, setShowForgotUsername] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className={'mw-75ch ' + styles.container}>
            <div className={styles.upper}>
                <ForgotLoginButtons
                    showForgotUsername={showForgotUsername}
                    setShowForgotUsername={setShowForgotUsername}
                    showForgotPassword={showForgotPassword}
                    setShowForgotPassword={setShowForgotPassword}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </div>

            <ForgotUsername
                email={email}
                showForgotUsername={showForgotUsername}
                success={success}
                error={error}
                setError={setError}
                setSuccess={setSuccess}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />

            <ForgotPassword
                username={username}
                email={email}
                showForgotPassword={showForgotPassword}
                success={success}
                error={error}
                setError={setError}
                setSuccess={setSuccess}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        </div>
    );
}
