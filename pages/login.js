import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ForgotLoginInfo from '../components/ForgotLoginInfo';
import Loading from '../components/Loading';

export default function Login() {
    const { status } = useSession();

    const router = useRouter();
    // get the redirect query parameter if there is one... if not, set the homepage as the redirect location
    let redirectUrl = router.query.url || '/';
    // set an array of query parameters that are not allowed to be redirected to
    const notRedirectable = ['/reset-password-success', '/register', '/login'];
    // if a resistricted query parameter is included, redirect to the homepage
    if (notRedirectable.indexOf(redirectUrl) > -1) redirectUrl = '/';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();

        // use the built-in signIn function of next-auth to try to sign in a user
        const loginStatus = await signIn('credentials', {
            redirect: false,
            username: username,
            password: password,
        });

        // if the user did not successfully log in, set the error that will be displayed
        if (!loginStatus?.ok || loginStatus?.status !== 200) {
            setError('Login Failed... check your credentials and try again.');
        }
    };

    if (status === 'loading') return <Loading />;

    if (status === 'authenticated') router.push(redirectUrl);

    if (status === 'unauthenticated') {
        return (
            <>
                <Head>
                    <title>
                        Login
                    </title>
                </Head>

                <article>
                    <h2 className="page-heading">
                        Login
                    </h2>

                    {error &&
                        <p className="validation-error">
                            {error}
                        </p>
                    }

                    <form method="post" onSubmit={handleSignIn} className="form">
                        <FormInput
                            id="username"
                            label="Username"
                            name="username"
                            type="text"
                            value={username}
                            required={true}
                            handleChange={(e) => setUsername(e.target.value)}
                        />

                        <FormInput
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            required={true}
                            handleChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="btn-container">
                            <Button type="submit" size="medium" variant="contained">Sign In</Button>
                        </div>
                    </form>

                    <ForgotLoginInfo />
                </article>

            </>
        );
    }
}
