'use client';

import { useRef, useState } from 'react';
import ForgotLoginButtons from './ForgotLoginButtons';
import ForgotUsername from './ForgotUsername';
import ForgotPassword from './ForgotPassword';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgottenUsername() {
    const username = useRef('');
    const email = useRef('');

    const [showForgotUsername, setShowForgotUsername] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <div className={'mw-75ch ' + styles.container}>
            <div className={styles.upper}>
                <ForgotLoginButtons
                    showForgotUsername={showForgotUsername}
                    setShowForgotUsername={setShowForgotUsername}
                    showForgotPassword={showForgotPassword}
                    setShowForgotPassword={setShowForgotPassword}
                />
            </div>

            {showForgotUsername &&
                <ForgotUsername
                    email={email}
                />
            }

            {showForgotPassword &&
                <ForgotPassword
                    username={username}
                    email={email}
                />
            }
        </div>
    );
}
