import { getToken } from 'next-auth/jwt';
import { changeUsername } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const token = await getToken({ req });
    if (!token) return res.status(401).end();
    if (!req.query._id || !req.body.username) return res.status(400).end();
    if (token?._id !== req.query._id) return res.status(401).end();

    try {
        // the changeUsername serverless function will first make sure the username isn't already in use and then will make the change if it's not in use
        const response = await changeUsername(req.query._id, req.body.username);
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
