import PropTypes from 'prop-types';
import Button from '../Button';
import FormInputForUsername from '../FormInputForUsername';
import FormInputForEmail from '../FormInputForEmail';
import Loading from '../Loading';

import styles from '../../../styles/ForgotLoginInfo.module.css';

export default function ForgotPassword({ username, email, showForgotPassword, success, error, setError, setSuccess, isSubmitting, setIsSubmitting }) {
    const handlePasswordSubmit = async (e) => {
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
        });

        setIsSubmitting(false);

        switch (res?.status) {
            case undefined:
                setError('An error occurred. Please try your request again.');
                break;
            case 200:
                setError(false);
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
        <>
            {showForgotPassword &&
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
            }
        </>
    );
}

ForgotPassword.propTypes = {
    username: PropTypes.object,
    password: PropTypes.object,
    email: PropTypes.object,
    showForgotPassword: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.string,
    setError: PropTypes.func,
    setSuccess: PropTypes.func,
    isSubmitting: PropTypes.bool,
    setIsSubmitting: PropTypes.func,
};
