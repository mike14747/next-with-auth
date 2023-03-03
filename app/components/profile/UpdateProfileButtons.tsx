import { Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import { ViewButtonState } from '../../../types';

import styles from '../../../styles/profile.module.css';

type UpdateProfileButtonsProps = {
    viewState: ViewButtonState
    setViewState: Dispatch<SetStateAction<ViewButtonState>>;
}

export default function UpdateProfileButtons({ viewState, setViewState }: UpdateProfileButtonsProps) {
    return (
        <nav aria-label="Update / Delete your account navigation" className={styles.showButtonNav}>
            <h3 className={styles.updateButtonsHeading}>Update / Delete your account</h3>

            {viewState.showChangeUsername
                ? <Button onClick={() => {
                    setViewState(prev => ({ ...prev, showChangeUsername: false }));
                }} type="button" size="small" variant="text" theme="primary">Hide Update Username</Button>
                : <Button onClick={() => {
                    setViewState(() => ({
                        showChangeUsername: true,
                        showChangePassword: false,
                        showChangeEmail: false,
                        showDeleteAccount: false,
                    }));
                }} type="button" size="small" variant="text" theme="primary">Update Username</Button>
            }

            {viewState.showChangePassword
                ? <Button onClick={() => {
                    setViewState(prev => ({ ...prev, showChangePassword: false }));
                }} type="button" size="small" variant="text" theme="primary">Hide Update Password</Button>
                : <Button onClick={() => {
                    setViewState(() => ({
                        showChangeUsername: false,
                        showChangePassword: true,
                        showChangeEmail: false,
                        showDeleteAccount: false,
                    }));
                }} type="button" size="small" variant="text" theme="primary">Update Password</Button>
            }

            {viewState.showChangeEmail
                ? <Button onClick={() => {
                    setViewState(prev => ({ ...prev, showChangeEmail: false }));
                }} type="button" size="small" variant="text" theme="primary">Hide Update Email</Button>
                : <Button onClick={() => {
                    setViewState(() => ({
                        showChangeUsername: false,
                        showChangePassword: false,
                        showChangeEmail: true,
                        showDeleteAccount: false,
                    }));
                }} type="button" size="small" variant="text" theme="primary">Update Email</Button>
            }

            {viewState.showDeleteAccount
                ? <Button onClick={() => {
                    setViewState(prev => ({ ...prev, showDeleteAccount: false }));
                }} type="button" size="small" variant="text" theme="primary">Hide Delete Account</Button>
                : <Button onClick={() => {
                    setViewState(() => ({
                        showChangeUsername: false,
                        showChangePassword: false,
                        showChangeEmail: false,
                        showDeleteAccount: true,
                    }));
                }} type="button" size="small" variant="text" theme="primary">Delete Account</Button>
            }
        </nav>
    );
}
