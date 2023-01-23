import PropTypes from 'prop-types';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForNewPassword from '../FormInputForNewPassword';

import styles from '../../../styles/profile.module.css';

export default function UpdatePassword({ user, password, repeatPassword, viewState, errorState, setErrorState, loadingState, setLoadingState }) {
    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.current !== repeatPassword.current) {
            setErrorState(prev => ({ ...prev, passwordError: 'Passwords do not match.' }));
            return;
        }

        setLoadingState(prev => ({ ...prev, isLoadingPassword: true }));

        const res = await fetch('/api/users/' + user._id + '/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ password: password.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingPassword: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setErrorState(prev => ({ ...prev, passwordError: null }));
                signOut({ callbackUrl: '/' });
                break;
            case 400:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. New password is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, passwordError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, passwordError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, passwordError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    return (
        <>
            {viewState.showUpdatePassword &&
                <>
                    <h3 className={styles.updateHeading}>Update your password:</h3>

                    <p className={styles.note}>
                        <strong>Note:</strong> changing your password will log you out.
                    </p>

                    <form className={styles.updateGroup} onSubmit={handleUpdatePasswordSubmit}>
                        {loadingState.isLoadingPassword && <Loading />}

                        {errorState.passwordError && <p className={styles.error}>{errorState.passwordError}</p>}

                        <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                        <Button type="submit" size="medium" variant="contained" theme="secondary">Apply</Button>
                    </form>
                </>
            }
        </>
    );
}
UpdatePassword.propTypes = {
    user: PropTypes.object,
    password: PropTypes.object,
    repeatPassword: PropTypes.object,
    viewState: PropTypes.object,
    errorState: PropTypes.object,
    setErrorState: PropTypes.func,
    loadingState: PropTypes.object,
    setLoadingState: PropTypes.func,
};
