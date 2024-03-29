'use client';

import { FormEvent, ChangeEvent, useRef, useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import ForgotLoginInfo from '@/components/login/ForgotLoginInfo';
import Loading from '@/components/Loading';

export default function Login() {
    const { status } = useSession();

    const router = useRouter();
    const searchParams = useSearchParams();
    // get the redirect query parameter if there is one... if not, set the homepage as the redirect location
    let redirectUrl = searchParams?.get('callbackUrl') || '/';

    // set an array of query parameters that are not allowed to be redirected to
    const notRedirectable = ['/reset-link', '/reset-password-success', '/register', '/login'];

    // check to see whether the query parameter is on the not allowed list
    const notRedirectableCheck = notRedirectable.filter(url => redirectUrl.includes(url));
    // if a resistricted query parameter is included, redirect to the homepage
    if (notRedirectableCheck.length > 0) redirectUrl = '/';

    const username = useRef<string>('');
    const password = useRef<string>('');
    const [error, setError] = useState<string>('');

    const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // use the built-in signIn function of next-auth to try to sign in a user
        const loginStatus = await signIn('credentials', {
            username: username.current,
            password: password.current,
            // redirect: false,
            callbackUrl: redirectUrl,
        });

        // if the user did not successfully log in, set the error that will be displayed
        if (loginStatus && (!loginStatus.ok || loginStatus.status !== 200)) {
            setError('Login Failed... check your credentials and try again.');
        }
    };

    useEffect(() => {
        if (status === 'authenticated') router.push(redirectUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    if (status === 'loading') return <Loading />;

    if (status === 'unauthenticated') {
        return (
            <main id="main">
                <article>
                    <h2 className="page-heading">
                        Login
                    </h2>

                    {error &&
                        <p className="validation-error">
                            {error}
                        </p>
                    }

                    <form onSubmit={handleSignIn} className="form">
                        <FormInput
                            id="username"
                            label="Username"
                            name="username"
                            type="text"
                            required={false}
                            handleChange={(e: ChangeEvent<HTMLInputElement>) => username.current = e.target.value}
                        />

                        <FormInput
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            required={false}
                            handleChange={(e: ChangeEvent<HTMLInputElement>) => password.current = e.target.value}
                        />

                        <div className="btn-container">
                            <Button type="submit" size="medium" variant="contained">Sign In</Button>
                        </div>
                    </form>

                    <ForgotLoginInfo />
                </article>

            </main>
        );
    }

    return null;
}
