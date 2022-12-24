import { resetPassword } from '../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'POST') return res.status(401).end();
    if (!req.body.username || !req.body.email) return res.status(400).end();

    try {
        const baseUrl = req.headers.origin;

        const response = await resetPassword(req.body.username, req.body.email, baseUrl);
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
