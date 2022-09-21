import { getSession } from 'next-auth/react';
import { updateUserPassword } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!session && (!req.body.userId || !req.body.token)) return res.status(401).end();
    if (session && !req?.body?.password) return res.status(400).end();

    try {
        let response;
        if (session) {
            response = await updateUserPassword(session.user._id, req.body.password);
        } else if (req.body.userId && req.body.token) {
            response = await updateUserPassword(parseInt(req.body.userId), req.body.password, req.body.token);
        } else {
            return res.status(400).end();
        }

        if (!response) return res.status(500).end();
        response?.changedRows === 1 ? res.status(200).json(response) : res.status(400).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
