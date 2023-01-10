# next-with-auth

![Node](https://img.shields.io/badge/Node-339933?style=flat-square&logo=nodedotjs&logoColor=ffffff 'Node')
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=f5f5f5 'Next.js')
![NextAuth](https://img.shields.io/badge/N-NextAuth-7C14D7.svg?style=flat-square&colorA=1BAFEF 'NextAuth')
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=ffffff 'MongoDB')
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=f5f5f5 'ESLint')
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=f5f5f5 'Vercel')

This is my reference app for creating a next.js app using next-auth.

It includes public and protected pages.

It includes public and protected api routes.

It even has different levels of access for the different private routes (user vs admin).

I was using client-side authentication on secure pages, then chose to use middleware to secure the protected pages. But, now that I've upgraded the app to next.js version 13, I'm using what I think is the current best way to secure those pages... checking for a session in Server Components.

I'm hopeful that middleware will be the ultimate solution, but I've found the **withAuth** functionality in middleware to currently be too buggy to trust. It will sometimes return a token as null if when a user is signed in. Then it's an infinite loop going back and forth from the login page (which correctly knows the user is signed in). Sometimes a page refresh fixes the problem, sometimes not.

Right now the only type of sign in is using **Credentials**. I'd like to add a few other types of options at some point.

---

### Starting this project

Create a new project at github. Be sure the include a _Node_ **.gitignore** file and a **README.md** file.

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
cd components && touch Header.js Navbar.js Footer.js Layout.js
cd ../lib && mkdir api
cd ../pages && mkdir api && touch _document.js _app.js 404.js index.js
cd ../public && mkdir images
cd ../../styles && touch globals.css Home.module.css Header.module.css Footer.module.css

```

Some of the above created files will need to be populated with code before this app will work. That will follow in subsequent sections.

I added **.env** to my **.gitignore** file, because by default the github node .gitignore file only includes .env.local.

**UPDATE**: I've upgraded this app to use next.js version 13, so the initial folder/file structure I listed above is now longer valid. This is the current setup which I've changed to:

```bash
touch .env
mkdir app lib pages public
cd app && mkdir shared && touch page.js layout.js head.js Header.js Navbar.js Footer.js Layout.js globals.css Home.module.css Header.module.css Navbar.module.css Footer.module.css
cd ../lib && mkdir api
cd ../pages && mkdir api
cd ../public && mkdir images

```

---

### Populating the newly created files

For starters, let's populate just the files necessary to run the app. I've included my custom **SkipTpMain** component so anyone can hit tab on any page to quickly navigate to the **Main** section.

**UPDATE**: the **Layout** component is no longer used in next.js version 13.

**/components/Layout.js**

```js
import PropTypes from 'prop-types';
import SkipToMain from './SkipToMain';

import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <SkipToMain />
            <Header />
            <Navbar />

            <main id="main" className="main-container">
                {children}
            </main>

            <Footer />
        </Navbar>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default Layout;
```

**/pages/\_app.js**

**NOTE**: **\_app.js** will need to have some additions made to it once **next-auth** is installed.

**UPDATE**: the **\_app.js** page is no longer used in next.js version 13.

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

**UPDATE**: the **\document.js** page is no longer used in next.js version 13.

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

You can uncomment one of the favicon lines if you add a favicon to: **/public/images**. If you do that, you'll need to comment the line that disables them.

```js
<link rel="icon" href="data:," />
```

The initial **Header**, **Navbar** and **Footer** are just basic functional components. The **Authbar** component imported in the Header will be utilized after Next-Auth is setup, so for now it's just commented out.

```js
// /app/Header.js

import Link from 'next/link';
// import Authbar from './Authbar'; // this path was changed now that I'm using next.js version 13

import styles from './Header.module.css'; // this path was changed now that I'm using next.js version 13

export default function Header() {
    return (
        <div className={styles.headerContainer}>
            <header className={styles.header + ' container'}>
                <div className={styles.leftDiv}>
                    <h1 className={styles.h1}>next-with-auth</h1>

                    <p>
                        <Link href="/">Home</Link>
                    </p>
                </div>

                <div className={styles.rightDiv}>{/* <Authbar /> */}</div>
            </header>
        </div>
    );
}
```

...and

```js
// /app/Navbar.js

import Link from 'next/link';

import styles from './Navbar.module.css'; // this path was changed now that I'm using next.js version 13

export default function Navbar() {
    return (
        <nav className={styles.nav + ' container'}>
            <ul>
                <li>{/* links to all the pages will go in these list items using the Link component */}</li>
            </ul>
        </nav>
    );
}
```

...and

```js
// /app/Footer.js

import styles from './Footer.module.css'; // this path was changed now that I'm using next.js version 13

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

I'm only using the database to store user data... not sessions. JWT sessions are being implemented.

I opted for and installed **mongodb** along with **next-auth** instead of going with an sql database because hosting a remote database on Atlas is free for a low usage app like this one.

```bash
npm i next-auth mongodb
```

Setting up the database on **Atlas** and adding that connection info to my **.env** (as MONGODB_URI and MONGODB_DB values) was next up. I created 2 users in the initial database... one with **user** privileges and one with **admin** privileges (test-user and admin-user).

Then there is the database connection file (/lib/mongodb.js). This will be imported by any serverless function that needs to query the remote database.

You'll need to create some properties in your **.env file** for next-auth to use.

You can generate a next-auth secret like this:

```bash
openssl rand -base64 32
```

Here are sample values just to show what it should look like (these are not used in this or any app):

```txt
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET='i53ZfJ4PGVPcXHfl9MNPzXOhp4AE7upZconfP/VwxAo='
```

One necessary file for next-auth is **/pages/api/auth/\[...nextauth\]**. This is where you set up your auth providers. In this app, I'm only using a **credentials provider** with a **username** and **password**. For this app, the file looks like this:

```js
// /page/api/auth/[...nextauth]

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user';

export default NextAuth({
    providers: [
        Credentials({
            // the name and credentials properties are not needed since we are using a custom login page
            // I've commented them out but kept them in here in case they become needed
            // name: 'username/password',
            // credentials: {
            //     username: { label: 'Username', type: 'text' },
            //     password: { label: 'Password', type: 'password' },
            // },

            async authorize(credentials) {
                const user = await getUserForSignin(credentials.username, credentials.password);

                // I'm adding user id, username and role to the user object... which need to also be added to the token and session below in the callback ffunctions
                return user ? { _id: user._id, name: user.username, role: user.role } : null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 90 * (24 * 60 * 60), // 24 * 60 * 60 is 1 day
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // I'm adding some extra properties to the jwt... this is where you must add them
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.role) token.role = user.role;
            return token;
        },
        // I'm adding some extra properties to the session... this is where you must add them
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

**UPDATE**: the **\_app.js** page is no longer used in next.js version 13.

```js
// /pages/_app.js

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

Since an attempt to access a protected page would lead to a redirect to the login page, I've set the login page to monitor for a callbackUrl query parameter. That way, if the login is successful, the browser would redirect to the page the user was trying to go to in the first place.

There is also an array of possible callbackUrl query parameters that are bypassed upon a successful login. Those include: **/reset-link**, **/reset-password-success**, **/register** and the **/login** page itself. If any of these page are passed as a query parameter, the successful login redirect will send the user to the **homepage**. In fact, my check is to see if any of the redirect urls start with any of the _notRedirectable_ array items. This is because some of them (eg: /reset-link) will include query parameters so I can't just do an indexOf check on the array.

**NOTE**: the **callbackUrl** has to either be an **absolute url from the same domain** or a **relative url starting with a "/"**.

```js
const router = useRouter();
const searchParams = useSearchParams();
// get the redirect query parameter if there is one... if not, set the homepage as the redirect location
let redirectUrl = searchParams.get('callbackUrl') || '/';

// set an array of query parameters that are not allowed to be redirected to
const notRedirectable = ['/reset-link', '/reset-password-success', '/register', '/login'];

// check to see whether the query parameter is on the not allowed list
const notRedirectableCheck = notRedirectable.filter((url) => redirectUrl.includes(url));
// if a resistricted query parameter is included, redirect to the homepage
if (notRedirectableCheck.length > 0) redirectUrl = '/';
```

---

### I forgot my login info

On the login page, I've imported a **ForgotLoginInfo** component which allows users to retrieve their username or get a reset password link via email.

I've implemented NodeMailer to handle the emails. The configuration for NodeMailer is in: /lib/nodemailerConfig.js and also in the .env file.

A user can have all usernames associated with the email address they enter emailed to them.

To receive a password reset link in an email, users need to enter both their username and email address. If both of these match a valid user, a resetPasswordToken field is created or updated in the database... along with a resetPasswordExpires field. Each request is valid for 60 minutes.

---

### Pages

There are 3 types of pages in this app.

1.  **Public** pages that can be viewed by anyone regardless of whether they are logged in. The homepage and public pages are examples of this type of page.
2.  **Protected** pages that can only be viewed by a logged in user. The protected and profile pages are examples of this type of page.
3.  **Admin** pages that can only be viewed by a user logged in with a role of admin. The admin page is an example of this type of page.

**Public pages**

There's nothing unusual about my public pages. The following is a basic public page that does client side data fetching, though most public pages would likely be either server-side rendered or would be static pages.

**UPDATE**: now that I've upgraded to next.js version 13, I'm using the new **/app** folder for all my pages and am taking advantage of their new Server Components as much as possible. As of 2023-01-09, his is an example of my old method of page construction. See below for the new method.

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
            .then((res) => {
                if (!res.ok) throw new Error('An error occurred fetching data.');
                return res.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    console.error(error.name + ': Data fetching was aborted.');
                } else {
                    console.error(error.name + ': ' + error.message);
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
                <title>Public Page</title>
            </Head>

            <article>
                <h2 className="page-heading">Public Page</h2>

                {error && <p className="error">{error}</p>}

                {isLoading && <Loading />}

                {data?.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>{item.name}</li>
                        ))}
                    </ul>
                )}
            </article>
        </>
    );
}
```

This is my new way of using public pages that don't have any user interaction.

Notice that I'm calling a serverless function directly in my page file. This is possible because all pages are now Server Components by default.

```js
import { getUnprotectedData } from '../../lib/api/index';

async function getData() {
    return await getUnprotectedData().catch((error) => console.log(error.message));
}

export default async function Page() {
    const data = await getData().catch((error) => console.log(error.message));

    return (
        <>
            <article>
                <h2 className="page-heading">Public Page</h2>

                <p>This page is getting data on the server-side, right in the component.</p>

                {data?.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>{item.name}</li>
                        ))}
                    </ul>
                )}
            </article>
        </>
    );
}
```

**Protected pages**

This is my standard client-side protected page. It only fetches data if a user is authenticated. If a user is not authenticated, the user is redirected to the login page.

**UPDATE**: now that I've upgraded to next.js version 13, I'm using the new **/app** folder for all my pages and am taking advantage of their new Server Components as much as possible. As of 2023-01-09, his is an example of my old method of page construction. See below for the new method.

```js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

export default function Protected() {
    const { status } = useSession();

    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // this short-circuits useEffect so it won't proceed if the status is loading, a user is not signed in while navigating to this page or a user signs out while on this page
        if (status !== 'authenticated') return;

        const abortController = new AbortController();

        if (status === 'authenticated') {
            setIsLoading(true);

            fetch('/api/protected', { signal: abortController.signal })
                .then((res) => {
                    if (!res.ok) throw new Error('An error occurred fetching data.');
                    return res.json();
                })
                .then((data) => {
                    setData(data);
                    setError(null);
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        console.error(error.name + ': Data fetching was aborted.');
                    } else {
                        console.error(error.name + ': ' + error.message);
                        setData(null);
                        setError('An error occurred fetching data.');
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setData(null);
        }

        return () => abortController.abort();
    }, [status]);

    // these are the possible outcomes of this page based upon the 3 possible values of status (loading, unauthenticated and authenticated)

    // loading: display the Loading component
    if (status === 'loading') return <Loading />;

    // unauthenticated: redirect to the login page with the query parameter set so the login page will send them back here if they successfully log in
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/protected');

    // authenticated: render the page as intended
    // this doesn't have to have a condition attached to it since it's the only option remaining if the code gets this far, but it makes it easier to understand what's going on, so I've included it
    if (status === 'authenticated') {
        return (
            <>
                <Head>
                    <title>Protected Page</title>
                </Head>

                <article>
                    <h2 className="page-heading">Protected Page</h2>

                    {error && <p className="error">{error}</p>}

                    {isLoading && <Loading />}

                    {data?.length > 0 && (
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>{item.name + ' - age: ' + item.age}</li>
                            ))}
                        </ul>
                    )}
                </article>
            </>
        );
    }

    return null;
}
```

This is my new way of using public pages that don't have any user interaction.

Notice that I'm calling a serverless function directly in my page file. This is possible because all pages are now Server Components by default.

```js
import { redirect } from 'next/navigation';
import { getProtectedData } from '../../lib/api/index';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';

async function getData() {
    return await getProtectedData().catch((error) => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token... including the expiry date
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });
    // doing this will get the session, but with the expiry date stripped out
    // const session = await unstable_getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/protected');
    }
    const data = await getData().catch((error) => console.log(error.message));

    return (
        <>
            <article>
                <h2 className="page-heading">Protected Page</h2>

                <p>This page is getting data on the server-side, right in the component.</p>

                {data?.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>{item.name + ' - age: ' + item.age}</li>
                        ))}
                    </ul>
                )}
            </article>
        </>
    );
}
```

---

**Pages protected by middleware**

Pages that are protected by middleware are the same as the public pages. They don't require code that's any different from the public pages.

The middleware does not allow anyone who is not authenticated to visit the page. The middleware sends the users to the login page (which handles the redirect back to the intended page upon successfully signing in).

**NOTE**: I'm currently not using middleware to protect any pages, because as I said above, I feel next-auth is too buggy with middleware.

---

**Admin pages**

These pages are very similar to the client-side protected pages... with the following exception:

-   I fully destructure the useSession() object because the session (more specifically the user's role) will be needed.

```js
const { data: session, status } = useSession();
```

-   Inside the useEffect() hook (and the very first line), data is not fetched unless a signed in user has a role of admin.

```js
if (status !== 'authenticated' || session?.user?.role !== 'admin') return;
```

```jsx
{
    session?.user?.role !== 'admin' && (
        <>
            <p className="error">You are logged in, but do not have the proper credentials to view this page.</p>
        </>
    );
}

{
    session?.user?.role === 'admin' && <>{/* display the normal admin page */}</>;
}
```

```js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

export default function Admin() {
    // on this page we do need access to the session because in addition to knowing whether the user is sined in, we need to check whether the user's role is sufficient to access this page
    const { data: session, status } = useSession();
    const router = useRouter();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status !== 'authenticated' || session?.user?.role !== 'admin') return;

        const abortController = new AbortController();

        if (status === 'authenticated' && session?.user?.role === 'admin') {
            setIsLoading(true);

            fetch('/api/admin', { signal: abortController.signal })
                .then((res) => {
                    if (!res.ok) throw new Error('An error occurred fetching data.');
                    return res.json();
                })
                .then((data) => {
                    setData(data);
                    setError(null);
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        console.error(error.name + ': Data fetching was aborted.');
                    } else {
                        console.error(error.name + ': ' + error.message);
                        setData(null);
                        setError('An error occurred fetching data.');
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setData(null);
        }

        return () => abortController.abort();
    }, [status, session]);

    if (status === 'loading') return <Loading />;

    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin');

    if (status === 'authenticated') {
        return (
            <>
                <Head>
                    <title>Admin Page</title>
                </Head>

                <article>
                    <h2 className="page-heading">Admin Page</h2>

                    {session?.user?.role !== 'admin' && (
                        <>
                            <p className="error">
                                You are logged in, but do not have the proper credentials to view this page.
                            </p>

                            <p className="error">
                                Log out, then log back in as a user with the proper credentials to view this page.
                            </p>
                        </>
                    )}

                    {session?.user?.role === 'admin' && (
                        <>
                            {error && <p className="error">{error}</p>}

                            {isLoading && <Loading />}

                            {data?.length > 0 && (
                                <ul>
                                    {data.map((item, index) => (
                                        <li key={index}>
                                            {item.name + ' - age: ' + item.age + ' (salary: $' + item.salary + ')'}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </article>
            </>
        );
    }

    return null;
}
```

This is my new way of using admin pages that don't have any user interaction.

Notice that I'm calling a serverless function directly in my page file. This is possible because all pages are now Server Components by default.

```js
import { redirect } from 'next/navigation';
import { getAdminData } from '../../lib/api/index';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';
// import { authOptions } from '../../pages/api/auth/[...nextauth]';

async function getData() {
    return await getAdminData().catch((error) => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token... including the expiry date
    const session = await unstable_getServerSession({
        callbacks: { session: ({ token }) => token },
    });
    
    if (!session) {
        redirect('/login?callbackUrl=/admin');
    }

    let data = null;
    if (session.role === 'admin') {
        data = await getData().catch((error) => console.log(error.message));
        console.log({ data });
    }

    return (
        <>
            <article>
                <h2 className="page-heading">Admin Page</h2>

                {session?.role !== 'admin' && (
                    <>
                        <p className="error">
                            You are logged in, but do not have the proper credentials to view this page.
                        </p>

                        <p className="error">
                            Log out, then log back in as a user with the proper credentials to view this page.
                        </p>
                    </>
                )}

                {session?.role === 'admin' && (
                    <>
                        {data?.length > 0 && (
                            <ul>
                                {data.map((item, index) => (
                                    <li key={index}>
                                        {item.name + ' - age: ' + item.age + ' (salary: $' + item.salary + ')'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </article>
        </>
    );
}
```

When the admin pages are protected by middleware, I tend to have the middleware redirect users to the homepage if they're signed in, but don't have the role of admin. Any user not signed in would obviously be redirected to the login page because they don't have a role at all yet.

---

### API Routes

There are 3 types of API routes in this app.

1.  **Public** routes that can be accessed by anyone regardless of whether they are logged in.
2.  **Protected** routes that can only be accessed by a logged in user (or in some cases, a specific logged in user... eg: update email, password and username routes).
3.  **Admin** routes that can only be accessed by a user logged in with a role of admin.

**NOTE**: the use of an explicit _return_ must be used with the response and status code if there is code that could still be run in the event that the above conditions are not met.

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

import { getToken } from 'next-auth/jwt';
import { getProtectedData } from '../../lib/api';

export default async function protectedRoute(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    // make sure a user is signed in, so check for a token
    const token = await getToken({ req });

    // respond with status code 401 if there's no token
    if (!token) return res.status(401).end();

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
```

**Admin API route**

This is an example of an admin api route where a user must be signed in and have the role of "admin".

```js
// /pages/api/admin.js

import { getToken } from 'next-auth/jwt';
import { getAdminData } from '../../lib/api';

export default async function adminRoute(req, res) {
    // the only crud method allowed on this route is GET
    if (req.method !== 'GET') return res.status(401).end();

    // make sure a user is signed in, so check for a token
    const token = await getToken({ req });

    console.log({ token });

    // respond with status code 401 if there's no token or the user does not have a role of admin
    if (token?.role !== 'admin') return res.status(401).end();

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
        username: 'test-user',
        role: 'user',
    },
};

const session3 = {
    user: {
        username: 'test-admin',
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

### Using signOut()

The only place I'm using the next-auth **signOut()** is in the **Authbar** component.

Normally, I don't redirect upon signing out because my pages are protected client-side and will automatically redirect to the login page if you're on a protected page when you sign out.

However, redirecting to the homepage upon signing out is useful when using middleware to protect a page because once you're on a protected page, the middleware by itself won't be able to take you away from it upon signing out. I'll revert this back to the previous functionality if I can come up with a good solution to this.

```js
// /components/Authbar.js

<Button onClick={() => signOut({ redirect: false })} size="small" variant="text">Logout</Button>

// or with logging out always sending you to the homepage

<Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="text">Logout</Button>
```

---

### Deploying to vercel

There were warnings in the build process on vercel concerning the node version needing to be v12, v14 or v16 and by default vercel uses v18. So, I downgraded vercel's node version to v16 and the warnings went away.

I had an issue with my middleware not working when I deployed this app to vercel. It would get into an infinite loop and error out when I tried to access a middleware protected page. If you refreshed the page, you could get out of the error loop and the middleware protected pages would work. **UPDATE**: I'm not sure how or why, but this issue seems to have been resolved.

You need the **NEXTAUTH_URL** environment variable locally, but it's not needed if you deploy to vercel. Vercel will populate it itself as **VERCEL_URL**. You do need to make sure **Settings > Environment Variables > Automatically expose System Environment Variables** is checked.

---

### next/navigation

In next.js v13, **next/navigation** replaces **next/router** in the **/app** folder. You can still use _next/router_ in the _/pages_ folder.

```js
'use client';

import { useRouter } from 'next/navigation';

const router = useRouter();

// ...

if (status === 'unauthenticated') router.push('/login?callbackUrl=/protected');
```

```js
import { useSearchParams } from 'next/navigation';

export default async function CheckoutPage() {
    const searchParams = useSearchParams();

    return (
        <div>
            <h1>Checkout </h1>
            <p>{searchParams.toString()}</p>
        </div>
    );
}
```

---

### Todos

-   Write tests.
-   This doesn't really have anything to do with this app specifically, but I'd like to come up with a way to clear button and nav focus on next/link page transition.
-   Decide what to name the page.js components (Page vs the name of the route folder).
-   Switch over from client fetch to swr?
-   There is still a login redirect bug in middleware protected pages.
-   Why aren't my pages full height?
-   Should css files be moved out of the /styles folder and into the folders where they're being used?

**Finished**:

-   When next-auth middleware is supported in next.js version 13, update next to that version and implement the middleware. **UPDATE**: I tried using middleware with next.js version 13 in another app and it is working after all. Further testing seems to show that some combinations of next and next-auth versions have issues. I can confirm that next v13.0.5 is ok with next-auth v4.17.0. Also, next v13.1.1 is ok with next-auth v4.18.7. But, when I first went to next v13.1.1 it wasn't working with next-auth v4.10.3. Sometimes it seems like it might work locally, but not on vercel... other times the bad combos don't work on either.

---

![next-with-auth](next_with_auth.svg 'next-with-auth')
![by Mike Gullo](author.svg 'by Mike Gullo')

-   Live version: https://next-with-auth.vercel.app/
-   This project's github repo: https://github.com/mike14747/next-with-auth
-   Me on github: https://github.com/mike14747
-   Contact me at: mgullo.dev@gmail.com

![GitHub last commit](https://img.shields.io/github/last-commit/mike14747/next-with-auth?style=for-the-badge)
