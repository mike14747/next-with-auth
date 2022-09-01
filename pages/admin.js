import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

const Admin = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        if (session?.user?.role === 'admin') {
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
    }, [session]);

    if (loading) return <Loading />;

    if (!session?.user?.role || session.user.role !== 'admin') router.push('/login?url=/admin');

    if (session?.user?.role === 'admin') {
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
                </article>
            </>
        );
    }

    return null;
};

export default Admin;
