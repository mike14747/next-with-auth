// this will get all users and their info (but not riding data) if the http method is GET... and only if the user is logged in with the role of admin

// this route is also used for registering a new user... if the http method is POST

import { getSession } from 'next-auth/react';
import { getInfoForAllUsers, checkForAvailableUsername, registerNewUser } from '../../../lib/api';

export default async function users(req, res) {
    if (req.method === 'GET') {
        const session = await getSession({ req });
        if (!session?.user?.role || session.user.role !== 'admin') return res.status(401).end();

        try {
            const response = await getInfoForAllUsers();
            return response ? res.status(200).json(response) : res.status(500).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else if (req.method === 'POST') {
        // new user registration
        if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end();

        try {
            // first make sure the username isn't already in use
            const usernameResult = await checkForAvailableUsername(req.body.username);
            if (!usernameResult) return res.status(500).end();
            if (usernameResult.length > 0) return res.status(409).end();

            // since the username is not already in use, add the user's submission
            const response = await registerNewUser(req.body.username, req.body.password, req.body.email);
            return response ? res.status(201).end() : res.status(500).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else {
        res.status(401).end();
    }
}
