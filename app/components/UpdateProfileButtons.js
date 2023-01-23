import PropTypes from 'prop-types';
import Button from './Button';

import styles from '../../styles/profile.module.css';

export default function UpdateProfileButtons({ viewState, setViewState, setIsEmailUpdated, setDeleteCounter }) {
    return (
        <>
            <div>
                <h3 className={styles.updateButtonsHeading}>Update / Delete your account</h3>
                {viewState.showUpdateUsername
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdateUsername: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Username</Button>
                    : <Button onClick={() => {
                        setViewState(() => ({
                            showUpdateUsername: true,
                            showUpdatePassword: false,
                            showUpdateEmail: false,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Username</Button>
                }
            </div>

            <div>
                {viewState.showUpdatePassword
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdatePassword: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Password</Button>
                    : <Button onClick={() => {
                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: true,
                            showUpdateEmail: false,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Password</Button>
                }
            </div>

            <div>
                {viewState.showUpdateEmail
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showUpdateEmail: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Update Email</Button>
                    : <Button onClick={() => {
                        setIsEmailUpdated(false);

                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: false,
                            showUpdateEmail: true,
                            showDeleteAccount: false,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Update Email</Button>
                }
            </div>

            <div>
                {viewState.showDeleteAccount
                    ? <Button onClick={() => {
                        setViewState(prev => ({ ...prev, showDeleteAccount: false }));
                    }} type="button" size="small" variant="text" theme="primary">Hide Delete Account</Button>
                    : <Button onClick={() => {
                        setDeleteCounter(0);

                        setViewState(() => ({
                            showUpdateUsername: false,
                            showUpdatePassword: false,
                            showUpdateEmail: false,
                            showDeleteAccount: true,
                        }));
                    }} type="button" size="small" variant="text" theme="primary">Delete Account</Button>
                }
            </div>
        </>
    );
}

UpdateProfileButtons.propTypes = {
    viewState: PropTypes.object,
    setViewState: PropTypes.func,
    setIsEmailUpdated: PropTypes.func,
    setDeleteCounter: PropTypes.func,
};
