import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import FormInputForUsername from '../components/FormInputForUsername';
import FormInputForNewPassword from '../components/FormInputForNewPassword';
import FormInputForEmail from '../components/FormInputForEmail';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Register() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

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
        });

        if (res.status !== 201) {
            res.status === 400 && setError('An error occurred. One or more of the fields are missing or not in the proper format.');
            res.status === 409 && setError('An error occurred. The username you submitted is already in use.');
            res.status === 500 && setError('A server error occurred. Please try your submission again.');
        }

        if (res.status === 201) {
            setIsSuccessful(true);
            setError(null);
        }
    };

    return (
        <>
            <Head>
                <title>
                    Biking Log - Register
                </title>
            </Head>

            <>
                <h2 className="page-heading">
                    Register
                </h2>

                {loading &&
                    <Loading />
                }

                {error &&
                    <p className="validation-error">
                        {error}
                    </p>
                }

                {session &&
                    <p className="validation-error">
                        You cannot register as a new user while you are currently logged in.
                    </p>
                }

                {!loading && status === 'unauthenticated' && !isSuccessful &&
                    <form method="post" onSubmit={handleRegisterSubmit} className="form">
                        <FormInputForUsername username={username} setUsername={setUsername} />

                        <FormInputForEmail email={email} setEmail={setEmail} />

                        <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                        <div className="btn-container">
                            <Button type="submit" size="medium" variant="contained">Submit</Button>
                        </div>
                    </form>
                }

                {isSuccessful &&
                    <p className="success-large">You have successfully registered!</p>
                }
            </>
        </>
    );
}

Register.propTypes = {
    showSignin: PropTypes.bool,
};
