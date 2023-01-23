import PropTypes from 'prop-types';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';
import FormInputForUsername from '../FormInputForUsername';

import styles from '../../../styles/profile.module.css';

export default function UpdateUsername({ user, username, viewState, errorState, setErrorState, loadingState, setLoadingState }) {
    const handleUpdateUsernameSubmit = async (e) => {
        e.preventDefault();

        setLoadingState(prev => ({ ...prev, isLoadingUsername: true }));

        const res = await fetch('/api/users/' + user._id + '/change-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current }),
        }).catch(error => console.error(error.name + ': ' + error.message));

        if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingUsername: false }));

        switch (res?.status) {
            case undefined:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. Please try your update again.' }));
                break;
            case 200:
                setErrorState(prev => ({ ...prev, usernameError: null }));
                signOut({ callbackUrl: '/' });
                break;
            case 400:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. New username is not in the proper format.' }));
                break;
            case 401:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. You do not have permission to make this update.' }));
                break;
            case 409:
                setErrorState(prev => ({ ...prev, usernameError: 'An error occurred. The username you submitted is already in use.' }));
                break;
            case 500:
                setErrorState(prev => ({ ...prev, usernameError: 'A server error occurred. Please try your update again.' }));
                break;
            default:
                setErrorState(prev => ({ ...prev, usernameError: 'An unknown error occurred. Please try your update again.' }));
        }
    };

    return (
        <>
            {viewState.showUpdateUsername &&
                <>
                    <h3 className={styles.updateHeading}>Update your username:</h3>

                    <p className={styles.note}>
                        <strong>Note:</strong> changing your username will log you out.
                    </p>

                    <form className={styles.updateGroup} onSubmit={handleUpdateUsernameSubmit}>
                        {loadingState.isLoadingUsername && <Loading />}

                        {errorState.usernameError && <p className={styles.error}>{errorState.usernameError}</p>}

                        <FormInputForUsername username={username} />

                        <Button type="submit" size="medium" variant="contained" theme="primary">Apply</Button>
                    </form>
                </>
            }
        </>
    );
}
UpdateUsername.propTypes = {
    user: PropTypes.object,
    username: PropTypes.object,
    viewState: PropTypes.object,
    errorState: PropTypes.object,
    setErrorState: PropTypes.func,
    loadingState: PropTypes.object,
    setLoadingState: PropTypes.func,
};
