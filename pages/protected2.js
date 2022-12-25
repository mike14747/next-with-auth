import { useState, useEffect } from 'react';
import Head from 'next/head';
import Loading from '../components/Loading';

export default function Protected2() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        setIsLoading(true);

        fetch('/api/protected', { signal: abortController.signal })
            .then(res => {
                if (!res.ok) throw new Error('An error occurred fetching data.');
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.error(error.name + ': Data fetching was aborted.');
                } else {
                    console.error(error.name + ': ' + error.message);
                    setData(null);
                    setError('An error occurred fetching data.');
                }
            })
            .finally(() => setIsLoading(false));

        return () => abortController.abort();
    }, []);

    return (
        <>
            <Head>
                <title>
                    Protected by Middleware Page
                </title>
            </Head>

            <article>
                <h2 className="page-heading">
                    Protected by Middleware Page
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
