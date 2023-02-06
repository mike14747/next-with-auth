import PropTypes from 'prop-types';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Button from '../Button';
import Loading from '../Loading';

import styles from '../../../styles/profile.module.css';

export default function DeleteAccount({ id }: {id: string}) {
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [deleteCounter, setDeleteCounter] = useState<number>(0);

    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
            return;
        }

        if (deleteCounter > 0) {
            setIsSubmitting(true);

            const res = await fetch('/api/users/' + id + '/delete-account', {
                method: 'DELETE',
            }).catch(error => console.error(error.name + ': ' + error.message));

            if (!res || res.status !== 200) setIsSubmitting(false);

            switch (res?.status) {
                case undefined:
                    setError('An error occurred. Please try again.');
                    break;
                case 200:
                    setError('');
                    signOut({ callbackUrl: '/' });
                    break;
                case 400:
                    setError('An error occurred. A bad request was made.');
                    break;
                case 401:
                    setError('An error occurred. You do not have permission to delete this account.');
                    break;
                case 500:
                    setError('A server error occurred. Please try again.');
                    break;
                default:
                    setError('An unknown error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <h3 className={styles.deleteHeading}>Delete your account</h3>

            {isSubmitting && <Loading />}

            {error && <p className={styles.error}>{error}</p>}

            {deleteCounter > 0 &&
                <p>
                    Are you sure?
                </p>
            }

            <Button type="button" size={deleteCounter > 0 ? 'medium' : 'small'} variant="contained" theme="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </>
    );
}

DeleteAccount.propTypes = {
    id: PropTypes.string,
};
