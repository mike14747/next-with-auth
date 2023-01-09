'use client';

import { useState, useEffect } from 'react';
import Loading from '../shared/Loading';

export default function Page() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/public')
            .then(res => {
                if (!res.ok) throw new Error('An error occurred fetching data.');
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(error => {
                console.error(error.name + ': ' + error.message);
                setData(null);
                setError('An error occurred fetching data.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            <article>
                <h2 className="page-heading">
                    Public Page
                </h2>

                {error && <p className="error">{error}</p>}

                {isLoading && <Loading />}

                {data?.length > 0 &&
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </>
    );
}
