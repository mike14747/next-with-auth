import { useState, useCallback } from 'react';

export default function useSubmitForm(url, body) {
    const [statusCode, setStatusCode] = useState(undefined);
    const [isPending, setIsPending] = useState(true);

    const handleSubmit = useCallback(() => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        })
            .then(res => setStatusCode(res.status))
            .catch(error => console.error(error.name + ': ' + error.message))
            .finally(() => setIsPending(false));

        setIsPending(false);
    }, [url, body]);

    return {
        handleSubmit,
        statusCode,
        isPending,
    };
}
