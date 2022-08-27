import { getSession } from 'next-auth/react';
import { getAdminData } from '../../lib/api';

export default async function directory(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    // make sure a user is signed in, so check for a session
    const session = await getSession({ req });
    // respond with status code 401 if there's no session or the user does not have a role of admin
    if (!session || session.role !== 'admin') return res.status(401).end();

    try {
        // access a serverless function to retrieve data
        const response = await getAdminData();
        // if the data cannot be fetched respond with a status code of 500
        response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
