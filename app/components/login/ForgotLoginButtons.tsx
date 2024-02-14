'use client';

import { Dispatch, SetStateAction } from 'react';
import Button from '@/components/Button';

import styles from '@/styles/ForgotLoginInfo.module.css';

type ForgotLoginButtonsProps = {
    showForgotUsername: boolean;
    setShowForgotUsername: Dispatch<SetStateAction<boolean>>;
    showForgotPassword: boolean;
    setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
}

export default function ForgotLoginButtons({ showForgotUsername, setShowForgotUsername, showForgotPassword, setShowForgotPassword }: ForgotLoginButtonsProps) {
    return (
        <nav aria-label="Forgotten Login Information Navigation">
            <div className={styles.btnContainer}>
                {showForgotUsername
                    ? <Button onClick={() => setShowForgotUsername(false)} size="small" variant="text">Hide forgot my Username</Button>
                    : <Button onClick={() => {
                        setShowForgotUsername(true);
                        setShowForgotPassword(false);
                    }} size="small" variant="text">I forgot my Username</Button>
                }

                <span aria-hidden="true" className={styles.divider}>¯ \ _ (ツ) _ / ¯</span>
            </div>

            <div className={styles.btnContainer}>
                {showForgotPassword
                    ? <Button onClick={() => setShowForgotPassword(false)} size="small" variant="text">Hide forgot my Password</Button>
                    : <Button onClick={() => {
                        setShowForgotPassword(true);
                        setShowForgotUsername(false);
                    }} size="small" variant="text">I forgot my Password</Button>}
            </div>
        </nav>
    );
}
