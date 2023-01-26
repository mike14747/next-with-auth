'use client';

import { useState } from 'react';
import ForgotLoginButtons from './ForgotLoginButtons';
import ForgotUsername from './ForgotUsername';
import ForgotPassword from './ForgotPassword';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgottenUsername() {
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

            {showForgotUsername && <ForgotUsername />}

            {showForgotPassword && <ForgotPassword />}
        </div>
    );
}
