# next-with-auth

This is my reference app for creating a next.js app using next-auth.

It includes public and protected pages.

It includes public and protected api routes.

It even has different levels of access for the private routes (user vs admin).

---

### Starting this project

Create a new project at github. Be sure the include a **Node .gitignore** file and a **README.md** file.

Clone the project onto your local pc:

```bash
git clone git@github.com:mike14747/next-with-auth.git
```

Navigate into the newly created **next-with-auth** folder, then create a **package.json** file:

```bash
cd next-with-auth

npm init -y
```

Install the **next.js** app:

```bash
npm i next react react-dom
```

It seems that **prop-types** is no longer a core component of **React** and it needs to be installed as a stand alone package.

```bash
npm i prop-types
```

Add some things to **scripts** property in **package.json**... so it looks like this:

```json
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
}
```

Install this folder/file structure (include the last blank line and you won't have to hit enter after pasting it into the terminal):

```bash
touch .env
mkdir components lib pages public styles
cd components && touch Header.js Footer.js Layout.js
cd ../lib && mkdir api
cd ../pages && mkdir api && touch _document.js _app.js 404.js index.js
cd ../public && mkdir images
cd ../../styles && touch globals.css Home.module.css Header.module.css Footer.module.css

```

Some of the above created files will need to be populated with code before this app will work. That will follow in subsequent sections.

---

### Populating the newly created files

For starters, let's populate just the files necessary to run the app. I've included my custom **SkipTpMain** component so anyone can hit tab on any page to quickly navigate to the **Main** section.

**/components/Layout.js**

```js
import PropTypes from 'prop-types';
import SkipToMain from './SkipToMain';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <SkipToMain />
            <Header />

            <main id="main" className="main-container">
                {children}
            </main>

            <Footer />
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default Layout;
```

**/pages/\_app.js**

**Note**: **\_app.js** will need to have some additions made to it once **next-auth** is installed.

```js
import PropTypes from 'prop-types';
import Layout from '../components/Layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

MyApp.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.any,
};

export default MyApp;
```

**/pages/\_document.js**

```js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" href="data:," />
                    {/* <link rel="icon" type="image/png" href="/images/my_favicon-16x16.png" sizes="16x16" /> */}
                    {/* <link rel="icon" type="image/png" href="/images/my_favicon-32x32.png" sizes="32x32" /> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
```

The initial **Header** and **Footer** are just basic functional components. The **Authbar** component imported in the Header will be utilized after Next-Auth is setup, so for now it's just commented out.

```js
import Link from 'next/link';
// import Authbar from './Authbar';

import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        // to make the header full width, just omit the container class
        <div className={styles.header + ' container'}>
            <div className={styles.leftDiv}>
                <p>This is the Header component.</p>

                <p>
                    <Link href="/">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Home
                        </a>
                    </Link>
                </p>
            </div>

            {/* <div className={styles.rightDiv}>
                <Authbar />
            </div> */}
        </div>
    );
}
```

...and

```js
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        // to make the footer full width, just omit the container class
        <div className={styles.footer + ' container'}>
            <p className={styles.copyright}>&copy; 2022 next-with-auth</p>
        </div>
    );
}
```

---

### Linting rules and style guide

Because I didn't use **create-next-app** to create this app, I had to manually install **eslint**. First, I added this to **scripts** in **package.json**:

```json
"scripts": {
    // ...
    "lint": "next lint"
},
```

I ran the **lint** script.

```bash
npm run lint
```

I then stepped through the eslint setup: - Select **Strict (recommended)** > **eslint** and **eslint-config-next** should have been installed as well as a default **.eslintrc.json**. But, for some reason the packages were not being installed automatically, so I had to install them manually.

```bash
npm i -D eslint eslint-config-next
```

The following was in the default **.eslintrc.json**:

```json
{
    "extends": "next/core-web-vitals"
}
```

This an example of what I've been including my **.eslintrc.json** files in a next apps:

```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": ["eslint:recommended", "plugin:jsx-a11y/recommended", "next", "next/core-web-vitals"],
    "rules": {
        // my rules went here
    }
}
```

Extending **plugin:jsx-a11y/recommended** will improve accessibility rules.

My standard rules were added to **.eslintrc.json**.

I changed the error to a warning about using the **next/image** component instead of the \<img> tag (since I won't be using it), by adding this to **.eslintrc.json** rules:

```json
"@next/next/no-img-element": "warn"
```

---

### Setting up next-auth and a database

I opted for and installed **mongodb** along with **next-auth** instead of going with an sql database because hosting a remote database on Atlas is free for a low usage app like this one.

```bash
npm i next-auth mongodb
```

Setting up the database on **Atlas** and adding that connection info to my **.env** (as MONGODB_URI and MONGODB_DB values) was next up. I created 2 users in the initial database... one with **user** privileges and one with **admin** privileges.

Then there is the database connection file (/lib/mongodb.js). This will be imported by any serverless function that needs to query the remote database.

You'll need to create some properties in your .env file for next-auth to use.

To generate a key, you'll need to install an npm package globally.

```bash
npm install -g node-jose-tools
```

Then generate the new key.

```bash
jose newkey -s 256 -t oct -a HS512
```

You can generate a JWT secret like this:

```bash
openssl rand -base64 32
```

I create a very complex SALT with 12 characters. There are a lot of websites that can do it or you can just pick some random characters.

Here are some sample values just to show what the values should look like (these are not used in this or any app):

```text
JWT_SIGNING_PRIVATE_KEY='{"kty":"oct","kid":"w5AqKB5z0kyyX-THqwJ7AHmhqcfg1BiPziqr3MlJXsg","alg":"HS512","k":"Hvw6gokTv7CMN1HRXkuFiQC6GNiLKlL9jwpjSBpjDjw"}'
JWT_SECRET='i53ZfJ4PGVPcXHfl9MNPzXOhp4AE7upZconfP/VwxAo='
SALT='Cb+7[=lGapCq'
```

One necessary file for next-auth is **/pages/api/auth/\[...nextauth\]**. This is where you set up your auth providers. In this app, I'm only using a **credentials provider** with a **username** and **password**. For this app, the file looks like this:

```js
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user.js';

export default NextAuth({
    providers: [
        Credentials({
            name: 'username/password',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await getUserForSignin(credentials.username, credentials.password);
                return user ? { _id: user._id, name: user.username, role: user.role } : null;
            },
        }),
    ],
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 * 24 * 60 * 60 is 30 days
    },
    jwt: {
        signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    },
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.role) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.role) session.user.role = token.role;
            return session;
        },
    },
});
```

If I planned on using a sql database to store my users, I would change all references to **\_id** to **id**. But, since mongodb uses \_id, I just stuck to their protocol.

Some things to note with the next-auth file:

-   If you want to save any other properties in the jwt or session, it must be done in the **callbacks** functions (jwt and session).
-   You can have more providers (eg: email or OAuth). They would get added to the **providers** array.

I wrapped a session provider around the Layout component in **\_app.js**. Doing this makes the logged in status available to all components and pages. But, you could only wrap certain components or pages if you'd like.

```js
import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.any,
};

export default MyApp;
```

I added my standard **login**, **register** and **profile** pages.

Since an attempt to access a protected page would lead to a redirect to the login page, I've set the login page to monitor for a url query parameter. That way, if the login is successful, the browser would redirect to the page the user was trying to go to in the first place.

There is also an array of possible url query parameters that are bypassed upon a successful login. Those include: **reset-password-success**, **register** and the **login** page itself. If any of these page are passed as a query parameter, the successful login redirect will send the user to the **homepage**.

```js
const router = useRouter();
let redirectUrl = router.query.url || '/';
const notRedirectable = ['/reset-password-success', '/register', '/login'];
if (notRedirectable.indexOf(redirectUrl) > -1) redirectUrl = '/';
```

---

### I forgot my login info

---

### Pages

There are 3 types of pages in this app.

1.  **Public** pages that can be viewed by anyone regardless of whether they are logged in. The homepage and public pages are examples of this type of page.
2.  **Protected** pages that can only be viewed by a logged in user. The protected and profile pages are examples of this type of page.
3.  **Admin** pages that can only be viewed by a user logged in with a role of admin. The admin page is an example of this type of page.

**Public pages**

There's nothing unusual about my public pages. The following is a basic public page that does client side data fetching, though most public pages would likely be either server-side rendered or would be static pages.

```js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Loading from '../components/Loading';

export default function Public() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        fetch('/api/public', { signal: abortController.signal })
            .then(res => res.json())
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.error('Data fetching was aborted!');
                } else {
                    console.error(error);
                    setData(null);
                    setError('An error occurred fetching data.');
                }
            })
            .finally(() => setIsLoading(false));

        return () => abortController.abort();
    }, []);

    return (
        <>
            <Head>
                <title>
                    Public Page
                </title>
            </Head>

            <article>
                <h2 className="page-heading">
                    Public Page
                </h2>

                {error && <p className="error">{error}</p>}

                {isLoading && <Loading />}

                {data?.length > 0 &&
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                }
            </article>
        </>
    );
}
```

**Protected pages**

```js

```

---

### API Routes

There are 3 types of API routes in this app.

1.  **Public** routes that can be accessed by anyone regardless of whether they are logged in.
2.  **Protected** routes that can only be accessed by a logged in user (or in some cases, a specific logged in user... eg: update email, password and username routes).
3.  **Admin** routes that can only be accessed by a user logged in with a role of admin.

**Note**: the use of an explicit _return_ must be used with the response and status code if there is code that could still be run in the event that the above conditions are not met.

**Public API route**

```js
// /pages/api/public.js

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
```

**Protected API route**

Inside the async function are checks to make sure the following conditions are true (with a 401 status code being returned if they aren't):

1.  Check that the proper crud method is being used.
2.  Check that the user is logged via a session.

Only if the above conditions are met, the serverless function is called.

This is a sample of my typical protected API route.

```js
// /pages/api/protected.js

import { getSession } from 'next-auth/react';
import { getProtectedData } from '../../lib/api';

export default async function protectedRoute(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    // make sure a user is signed in, so check for a session
    const session = await getSession({ req });
    // respond with status code 401 if there's no session
    if (!session) return res.status(401).end();

    try {
        // access a serverless function to retrieve data
        const response = await getProtectedData();
        // if the data cannot be fetched respond with a status code of 500
        response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
```

Special protected API routes.

Some of my API routes required not only that a user is logged in, but that a certain user is logged in. The user.\_id in the session must match the query parameter user id.

This is an example of one of these special API routes (used to update a user's username).

```js
// /pages/api/users/[_id]/change-username.js

import { getSession } from 'next-auth/react';
import { checkForAvailableUsername, changeUsername } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (!req.query._id || !req.body.username) return res.status(400).end();
    if (session.user?._id !== req.query._id) return res.status(401).end();

    try {
        // first make sure the username isn't already in use
        const usernameResult = await checkForAvailableUsername(req.body.username);
        if (!usernameResult) return res.status(500).end();
        if (usernameResult.length > 0) return res.status(409).end();

        // since the username is not already in use, add the user's submission
        const response = await changeUsername(req.query._id, req.body.username);
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
```

**Admin API route**

This is an example of an admin api route where a user must be signed in and have the role of "admin".

```js
// /pages/api/admin.js

import { getSession } from 'next-auth/react';
import { getAdminData } from '../../lib/api';

export default async function adminRoute(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    // make sure a user is signed in, so check for a session
    const session = await getSession({ req });
    // respond with status code 401 if there's no session or the user does not have a role of admin
    if (session?.user?.role !== 'admin') return res.status(401).end();

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
```

---

This is how I'm testing my conditions using Quokka in VS Code:

```js
const session1 = null;

const session2 = {
    user: {
        username: 'user',
        role: 'user',
    },
};

const session3 = {
    user: {
        username: 'admin',
        role: 'admin',
    },
};

const status1 = 'loading';
const status2 = 'unauthenticated';
const status3 = 'authenticated';

const session = session1;
const status = status3;

console.log(status !== 'authenticated' || session?.user?.role !== 'admin');
```

---

### Todos

-   The **registerNewUser** serverless function in user.js needs to be converted from mysql to mongodb.
-   Need to add the following serverless functions in user.js: **forgotUsername** and **resetPassword**.