'use client';

import useSWR from 'swr';
import Loading from '../shared/Loading';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Page() {
    const { data, error, isLoading } = useSWR('/api/protected', fetcher);

    return (
        <>
            <article>
                <h2 className="page-heading">
                    Protected Page
                </h2>

                {error && <p className="error">An error occurred fetching data.</p>}

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
