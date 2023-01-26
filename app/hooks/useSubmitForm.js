import { useState, useCallback } from 'react';

export default function useSubmitForm(url, body) {
    const [statusCode, setStatusCode] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        setIsSubmitting(false);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        })
            .then(res => setStatusCode(res.status))
            .catch(error => console.error(error.name + ': ' + error.message))
            .finally(() => setIsSubmitting(false));

        setIsSubmitting(false);
    }, [url, body]);

    return {
        handleSubmit,
        statusCode,
        isSubmitting,
    };
}
