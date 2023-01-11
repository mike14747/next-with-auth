'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import FormInputForUsername from '../components/FormInputForUsername';
import FormInputForNewPassword from '../components/FormInputForNewPassword';
import FormInputForEmail from '../components/FormInputForEmail';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Page() {
    const { status } = useSession();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username, email, password }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setError('An error occurred sending the data.');
        });

        if (res) {
            if (res.status === 201) {
                setUsername(null);
                setPassword(null);
                setRepeatPassword(null);
                setIsSuccessful(true);
                setError(null);
            }

            res.status === 400 && setError('An error occurred. One or more of the fields are missing or not in the proper format.');
            res.status === 409 && setError('An error occurred. The username you submitted is already in use.');
            res.status === 500 && setError('A server error occurred. Please try your submission again.');
        }
    };

    return (
        <>
            <article>
                <h2 className="page-heading">
                    Register
                </h2>

                {status === 'loading' &&
                    <Loading />
                }

                {status === 'authenticated' &&
                    <p className="error">
                        You cannot register as a new user while you are currently logged in.
                    </p>
                }

                {status === 'unauthenticated' && !isSuccessful &&
                    <>
                        {error &&
                            <p className="error">
                                {error}
                            </p>
                        }

                        <form method="post" onSubmit={handleRegisterSubmit} className="form">
                            <FormInputForUsername username={username} setUsername={setUsername} />

                            <FormInputForEmail email={email} setEmail={setEmail} />

                            <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                            <div className="btn-container">
                                <Button type="submit" size="medium" variant="contained">Submit</Button>
                            </div>
                        </form>
                    </>

                }

                {status === 'unauthenticated' && isSuccessful &&
                    <p className="success-large">You have successfully registered!</p>
                }
            </article>
        </>
    );
}
