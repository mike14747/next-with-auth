import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

const Admin = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status !== 'authenticated' || !session?.user?.role || session.user.role !== 'admin') return;

        const abortController = new AbortController();

        if (status === 'authenticated' && session?.user?.role === 'admin') {
            setIsLoading(true);

            fetch('/api/admin', { signal: abortController.signal })
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
    }, [status, session]);

    if (status === 'loading') return <Loading />;

    if (status === 'unauthenticated') router.push('/login?url=/admin');

    if (status === 'authenticated') {
        return (
            <>
                <Head>
                    <title>
                        Admin Page
                    </title>
                </Head>

                <article>
                    <h2 className="page-heading">
                        Admin Page
                    </h2>

                    {session?.user?.role !== 'admin' &&
                        <>
                            <p className="error">You are logged in, but do not have the proper credentials to view this page.</p>

                            <p className="error">Log out, then log back in as a user with the proper credentials to view this page.</p>
                        </>
                    }

                    {session?.user?.role === 'admin' &&
                        <>
                            {error && <p className="error">{error}</p>}

                            {isLoading && <Loading />}

                            {data?.length > 0 &&
                                <ul>
                                    {data.map((item, index) => (
                                        <li key={index}>
                                            {item.name + ' - age: ' + item.age + ' (salary: $' + item.salary + ')'}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </>
                    }

                </article>
            </>
        );
    }

    return null;
};

export default Admin;
