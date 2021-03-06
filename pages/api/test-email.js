import { testEmail } from '../../lib/api';

export default async function settings(req, res) {
    if (req.method !== 'GET') return res.status(401).end();

    try {
        const response = await testEmail();
        response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
