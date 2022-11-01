import { getSession } from 'next-auth/react';
import { changeEmail } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (!req.query._id || !req.body.email) return res.status(400).end();
    if (session.user?._id !== req.query._id) return res.status(401).end();

    try {
        const response = await changeEmail(req.query._id, req.body.email);
        if (!response) return res.status(500).end();
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
