import PropTypes from 'prop-types';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';

import styles from '../../../styles/profile.module.css';

export default function DeleteAccount({ user, viewState, errorState, setErrorState, deleteCounter, setDeleteCounter, loadingState, setLoadingState }) {
    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
            return;
        }

        if (deleteCounter > 0) {
            setLoadingState(prev => ({ ...prev, isLoadingDelete: true }));

            const res = await fetch('/api/users/' + user._id + '/delete-account', {
                method: 'DELETE',
            }).catch(error => console.error(error.name + ': ' + error.message));

            if (!res || res.status !== 200) setLoadingState(prev => ({ ...prev, isLoadingDelete: false }));

            switch (res?.status) {
                case undefined:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. Please try again.' }));
                    break;
                case 200:
                    setErrorState(prev => ({ ...prev, deleteError: null }));
                    signOut({ callbackUrl: '/' });
                    break;
                case 400:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. A bad request was made.' }));
                    break;
                case 401:
                    setErrorState(prev => ({ ...prev, deleteError: 'An error occurred. You do not have permission to delete this account.' }));
                    break;
                case 500:
                    setErrorState(prev => ({ ...prev, deleteError: 'A server error occurred. Please try again.' }));
                    break;
                default:
                    setErrorState(prev => ({ ...prev, deleteError: 'An unknown error occurred. Please try again.' }));
            }
        }
    };

    return (
        <>
            {viewState.showDeleteAccount &&
                <>
                    <h3 className={styles.deleteHeading}>Delete your account</h3>

                    {loadingState.isLoadingDelete && <Loading />}

                    {errorState.deleteError && <p className={styles.error}>{errorState.deleteError}</p>}

                    {deleteCounter > 0 &&
                        <p>
                            Are you sure?
                        </p>
                    }

                    <Button type="button" size={deleteCounter > 0 ? 'medium' : 'small'} variant="contained" theme="danger" onClick={handleDeleteAccount}>Delete Account</Button>
                </>
            }
        </>
    );
}

DeleteAccount.propTypes = {
    user: PropTypes.object,
    viewState: PropTypes.object,
    errorState: PropTypes.object,
    setErrorState: PropTypes.func,
    deleteCounter: PropTypes.number,
    setDeleteCounter: PropTypes.func,
    loadingState: PropTypes.object,
    setLoadingState: PropTypes.func,
};
