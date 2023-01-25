import { useEffect, useState } from 'react';

export default function useFetch(url) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const abortController = new AbortController();

        fetch(url, { signal: abortController.signal })
            .then((res) => {
                if (!res.ok) throw new TypeError('An error occurred fetching data.');
                return res.json();
            })
            .then((json) => {
                setData(json);
            })
            .catch(error => {
                console.error(error.name + ': ' + error.message);
                setError(error.name + ': ' + error.message);
            })
            .finally(() => {
                setIsPending(false);
            });

        return () => abortController.abort();
    }, [url]);

    return {
        data,
        isPending,
        error,
    };
}
