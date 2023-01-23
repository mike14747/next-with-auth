import PropTypes from 'prop-types';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForEmail from '../FormInputForEmail';

import styles from '../../../styles/profile.module.css';

export default function UpdateEmail({ user, setUser, email, emailForm, isEmailUpdated, setIsEmailUpdated, viewState, errorState, setErrorState, loadingState, setLoadingState }) {
    const handleUpdateEmailSubmit = async (e) => {
        e.preventDefault();

        setIsEmailUpdated(false);
        setLoadingState(prev => ({ ...prev, isLoadingEmail: true }));

        const res = await fetch('/api/users/' + user._id + '/change-email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email: email.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        setLoadingState(prev => ({ ...prev, isLoadingEmail: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setUser(prev => ({
                    ...prev,
                    email: email.current,
                }));

                setErrorState(prev => ({ ...prev, emailError: null }));
                setIsEmailUpdated(true);
                emailForm.current.reset();
                break;
            case 400:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. New email is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, emailError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, emailError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, emailError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    return (
        <>
            {viewState.showUpdateEmail &&
                <>
                    <h3 className={styles.updateHeading}>Update your email:</h3>

                    {isEmailUpdated && <p className={styles.success}>Your email address has been successfully updated.</p>}

                    <form ref={emailForm} className={styles.updateGroup} onSubmit={handleUpdateEmailSubmit}>
                        {loadingState.isLoadingEmail && <Loading />}

                        {errorState.emailError && <p className={styles.error}>{errorState.emailError}</p>}

                        <FormInputForEmail email={email} />

                        <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                    </form>
                </>
            }
        </>
    );
}

UpdateEmail.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
    email: PropTypes.object,
    emailForm: PropTypes.object,
    isEmailUpdated: PropTypes.bool,
    setIsEmailUpdated: PropTypes.func,
    viewState: PropTypes.object,
    errorState: PropTypes.object,
    setErrorState: PropTypes.func,
    loadingState: PropTypes.object,
    setLoadingState: PropTypes.func,
};
