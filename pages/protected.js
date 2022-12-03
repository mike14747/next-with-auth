import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

export default function Protected() {
    // we could destructure useSession to get the session too if needed (as follows), but we don't need it on this page
    // const { data: session, status } = useSession();
    const { status } = useSession();

    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // this short-circuits useEffect so it won't proceed if the status is loading, a user is not signed in while navigating to this page or a user signs out while on this page
        if (status !== 'authenticated') return;

        const abortController = new AbortController();

        if (status === 'authenticated') {
            setIsLoading(true);

            fetch('/api/protected', { signal: abortController.signal })
                .then(res => res.json())
                .then(data => {
                    setData(data);
                    setError(null);
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        console.error('Data fetching was aborted!');
                    } else {
                        console.error(error);
                        setData(null);
                        setError('An error occurred fetching data.');
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setData(null);
        }

        return () => abortController.abort();
    }, [status]);

    // these are the possible outcomes of this page based upon the 3 possible values of status (loading, unauthenticated and authenticated)

    // loading: display the Loading component
    if (status === 'loading') return <Loading />;

    // unauthenticated: redirect to the login page with the query parameter set so the login page will send them back here if they successfully log in
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/protected');

    // authenticated: render the page as intended
    // this doesn't have to have a condition attached to it since it's the only option remaining if the code gets this far, but it makes it easier to understand what's going on, so I've included it
    if (status === 'authenticated') {
        return (
            <>
                <Head>
                    <title>
                        Protected Page
                    </title>
                </Head>

                <article>
                    <h2 className="page-heading">
                        Protected Page
                    </h2>

                    {error && <p className="error">{error}</p>}

                    {isLoading && <Loading />}

                    {data?.length > 0 &&
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>
                                    {item.name + ' - age: ' + item.age}
                                </li>
                            ))}
                        </ul>
                    }
                </article>
            </>
        );
    }

    return null;
}
