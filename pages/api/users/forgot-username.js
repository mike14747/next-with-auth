import { forgottenUsername } from '../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'POST') return res.status(401).end();

    try {
        const response = await forgottenUsername(req.body.email);
        if (!response) return res.status(500).end();
        response?.code === 200 ? res.status(200).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
