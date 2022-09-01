import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

const Protected = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        if (session) {
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
    }, [session]);

    if (status === 'loading') return <Loading />;

    if (status === 'unauthenticated') router.push('/login?url=/protected');

    if (session) {
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
};

export default Protected;
