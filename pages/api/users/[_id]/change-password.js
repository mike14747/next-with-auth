import { getSession } from 'next-auth/react';
import { changePassword } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!req.body.password) return res.status(400).end();
    if (!session && (!req.body.userId  || !req.body.token)) return res.status(401).end();

    try {
        let response;
        if (session) {
            response = await changePassword(session.user._id, req.body.password);
        } else if (req.body.userId && req.body.token) {
            response = await changePassword(req.body.userId, req.body.password, req.body.token);
        } else {
            return res.status(400).end();
        }

        if (!response) return res.status(500).end();
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
