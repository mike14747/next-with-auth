import { getUnprotectedData } from '../../lib/api';

export default async function publicRoute(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    try {
        // access a serverless function to retrieve data
        const response = await getUnprotectedData();
        // if the data cannot be fetched respond with a status code of 500
        response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
