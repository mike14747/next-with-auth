'use client';

import { useRef, useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import FormInputForUsername from '../components/FormInputForUsername';
import FormInputForNewPassword from '../components/FormInputForNewPassword';
import FormInputForEmail from '../components/FormInputForEmail';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Register() {
    const { status } = useSession();

    const username = useRef<string>('');
    const email = useRef<string>('');
    const password = useRef<string>('');
    const repeatPassword = useRef<string>('');

    const [error, setError] = useState<string>('');
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password.current !== repeatPassword.current) {
            setError('Passwords do not match.');
            return;
        }

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ username: username.current, email: email.current, password: password.current }),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setError('An error occurred sending the data.');
        });

        if (res) {
            if (res.status === 201) {
                setIsSuccessful(true);
                setError('');
            }

            if (res.status !== 201) {
                setIsSuccessful(false);

                res.status === 400 && setError('An error occurred. One or more of the fields are missing or not in the proper format.');
                res.status === 409 && setError('An error occurred. The username you submitted is already in use.');
                res.status === 500 && setError('A server error occurred. Please try your submission again.');
            }
        }
    };

    return (
        <main id="main">
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

                {status === 'unauthenticated' &&
                    <>
                        {error &&
                            <p className="error">
                                {error}
                            </p>
                        }

                        {isSuccessful &&
                            <p className="success-large">You have successfully registered!</p>
                        }

                        <form onSubmit={handleRegisterSubmit} className="form">
                            <FormInputForUsername username={username} />

                            <FormInputForEmail email={email} />

                            <FormInputForNewPassword password={password} repeatPassword={repeatPassword} />

                            <div className="btn-container">
                                <Button type="submit" size="medium" variant="contained">Submit</Button>
                            </div>
                        </form>
                    </>

                }
            </article>
        </main>
    );
}
