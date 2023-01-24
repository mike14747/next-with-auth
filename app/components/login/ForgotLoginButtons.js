import PropTypes from 'prop-types';
import Button from '../Button';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgotLoginButtons({ showForgotUsername, setShowForgotUsername, showForgotPassword, setShowForgotPassword, setError, setSuccess }) {
    return (
        <>
            <div className={styles.btnContainer}>
                {showForgotUsername
                    ? <Button onClick={() => setShowForgotUsername(false)} size="small" variant="text">Hide forgot my Username</Button>
                    : <Button onClick={() => {
                        setShowForgotUsername(true);
                        setShowForgotPassword(false);
                        setError(false);
                        setSuccess(false);
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
                        setError(false);
                        setSuccess(false);
                    }} size="small" variant="text">I forgot my Password</Button>}
            </div>
        </>
    );
}

ForgotLoginButtons.propTypes = {
    showForgotUsername: PropTypes.bool,
    setShowForgotUsername: PropTypes.func,
    showForgotPassword: PropTypes.bool,
    setShowForgotPassword: PropTypes.func,
    setError: PropTypes.func,
    setSuccess: PropTypes.func,
};
