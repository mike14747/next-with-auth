# next-with-auth

![Node](https://img.shields.io/badge/Node-339933?style=flat-square&logo=nodedotjs&logoColor=ffffff 'Node')
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=f5f5f5 'Next.js')
![NextAuth](https://img.shields.io/badge/N-NextAuth-7C14D7.svg?style=flat-square&colorA=1BAFEF 'NextAuth')
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=ffffff 'MongoDB')
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=f5f5f5 'ESLint')
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=f5f5f5 'Vercel')

## Introduction

This was my reference app for creating a next.js app using next-auth. However, it seems to have become my reference app for next.js version 13 (and the new appDir), middleware and typescript.

It includes public and protected pages.

It includes public and protected api routes.

It even has different levels of access for the different private routes (user vs admin).

I was using client-side authentication on secure pages, then chose to use middleware to secure the protected pages. But, now that I've upgraded the app to next.js version 13, I'm using what I think is the current best way to secure those pages... checking for a session in Server Components.

I'm hopeful that middleware will be the ultimate solution, but I've found the **withAuth** functionality in middleware to currently be too buggy to trust. It will sometimes return a token as null if when a user is signed in. Then it's an infinite loop going back and forth from the login page (which correctly knows the user is signed in). Sometimes a page refresh fixes the problem, sometimes not.

Right now the only type of sign in is using **Credentials**. I'd like to add a few other types of options at some point.

## I've decided to use the **/styles** folder for all my global and css modules. I chose that system over placing the css modules with the files that use them because some of the css modules are shared between multiple pages/components.

## Starting this project

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

**NOTE**: This app was updated to use typescript a while after creating it. For instructions on how to update it to typescript, see: coding-notes/typescript/nextjs.md.

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

Install this folder/file structure (include the last blank line and you won't have to hit enter after pasting it into the terminal). **NOTE**: This was the folder/file structure before I used the new appDir and typescript.

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

Since I've upgraded this app to use next.js version 13, the initial folder/file structure will now be the following.

**NOTE**: This was the folder/file structure before I updated the app to typescript.

```bash
touch .env
mkdir app lib pages public styles types
cd app && mkdir components && touch page.tsx layout.tsx head.tsx
cd components && touch Header.tsx Navbar.tsx Footer.tsx
cd ../../lib && mkdir api
cd ../pages && mkdir api
cd ../public && mkdir images
cd ../styles && touch mg_base.css globals.css Home.module.css Header.module.css Navbar.module.css Footer.module.css

```

More folders/files will need to be added for this app, but this is the basic skeleton structure to get started.

I added **.env** to my **.gitignore** file, because by default the github node .gitignore file only includes .env.local.

---

## Populating the newly created files

For starters, let's populate just the files necessary to run the app. I've included my custom **SkipToMain** component so anyone can hit tab on any page to quickly navigate to the **Main** section. There is an open issue with this component. When you navigate through the app's pages using \<Link\> components, the focus remains on the item you've clicked on after navigating (since the Navbar doesn't get rerendered upon navigation). This means you can only 'tab' to the SkipToMain component on full page refreshes. I don't know of a way around it at the moment. There would need to be a way of resetting focus upon navigation.

### New layout component

**UPDATE**: the **/components/Layout.js** component is no longer used in next.js version 13. This is how I set up its replacement in the **/app** folder... **layout.tsx**.

**NOTE**: this is the final product and includes some things I'm doing to test out some of its capabilities. The bare minimum to get started is far simpler than this.

```js
// /app/layout.tsx

import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import ClientSessionProvider from './components/ClientSessionProvider';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';
import { getSettings } from '../lib/api';
import { Session } from 'next-auth';

import '../styles/mg_base.css';
import '../styles/globals.css';

type RootLayoutProps = {
    children: ReactNode,
    session: Session,
    params: {
        numInitialNewsItems: number,
        newsItemIncrement: number,
    },
};

async function getSettingsData() {
    return await getSettings().catch((error) => console.log(error.message));
}

export default async function RootLayout({ children, session, params }: RootLayoutProps) {
    const settingsData = await getSettingsData().catch((error) => console.log(error.message));

    params.numInitialNewsItems = settingsData?.numInitialNewsItems || 20;
    params.newsItemIncrement = settingsData?.newsItemIncrement || 50;

    return (
        <html lang="en">
            <head />
            <body id="appWrapper">
                <ClientSessionProvider session={session}>
                    <SkipToMain />
                    <Header topInfoActive={settingsData?.topInfoActive} topInfoText={settingsData?.topInfoText} />
                    <Navbar />

                    <div className="page-container">
                        {children}
                        <ScrollTop />
                    </div>

                    <Footer contactEmail={settingsData?.contactEmail} />
                </ClientSessionProvider>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
```

Something to note in the above layout.tsx is that I needed to wrap a next-auth **SessionProvider** around all the components and pages in **/app/layout.tsx**, but I wanted to keep layout.tsx as a server component. With SessionProvider using React context, it can only be utilized in client components. So, I made a **/app/components/ClientSessionProvider.js** component that uses the SessionProvider, then imported that into layout.tsx. This allowed me to keep layout.tsx as a server component.

I'm not sure if this is best practice, but it seems work fine, so for now it's my preferred method.

```ts
// /app/compontents/ClientSessionProvider.tsx

'use client';

import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type ClientSessionProps = {
    children: ReactNode;
    session: Session;
};

export default function ClientSession({ children, session }: ClientSessionProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}

ClientSession.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
```

### Head info for each page

I've decided to use a **head.ts** file in each page folder (in addition to the root one for the homepage).

The only code that would differ in all the head.ts files is the title. So, instead of repeating all the code in every file, I've created a **DefaultHeadTags** component which includes all the repeat code. It looks like this:

```ts
// /app/components/DefaultHeadTags.ts

export default function DefaultHeadTags() {
    return (
        <>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            {/* <link rel="icon" href="data:," /> */}
            <link rel="icon" type="image/png" href="/images/next_with_auth_favicon-16x16.png" sizes="16x16" />
            <link rel="icon" type="image/png" href="/images/next_with_auth_favicon-32x32.png" sizes="32x32" />
        </>
    );
}
```

Then, each head.ts component can import it and only have to add the title for that page.

```ts
// /app/head.ts

import DefaultHeadTags from './components/DefaultHeadTags';

export default function Head() {
    return (
        <>
            <DefaultHeadTags />

            <title>next-with-auth</title>
        </>
    );
}
```

---

You can uncomment one of the favicon lines if you add a favicon to: **/public/images**. If you do that, you'll need to comment the line that disables them.

```js
<link rel="icon" href="data:," />
```

### Header, Navbar and Footer components

The initial **Header**, **Navbar** and **Footer** are just basic functional components. The **Authbar** component imported in the Header will be utilized after Next-Auth is setup, but for now it's just commented out.

The Header component has a couple test props being passed down from layout.tsx, while the Footer.tsx component receives a contact email prop (contactEmail) from layout.tsx.

```ts
// /app/components/Header.tsx

import PropTypes from 'prop-types';
import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../../styles/Header.module.css';

export default function Header({
    topInfoActive = false,
    topInfoText = '',
}: {
    topInfoActive: boolean;
    topInfoText: string;
}) {
    return (
        <header className={styles.header}>
            <div className={styles.headerBody + ' container'}>
                <div className={styles.leftDiv}>
                    <h1 className={styles.h1}>next-with-auth</h1>

                    {topInfoActive && topInfoText && (
                        <p>
                            <small>{topInfoText}</small>
                        </p>
                    )}

                    <p>
                        <Link href="/">Home</Link>
                    </p>
                </div>

                <div className={styles.rightDiv}>
                    <Authbar />
                </div>
            </div>
        </header>
    );
}

Header.propTypes = {
    topInfoActive: PropTypes.bool,
    topInfoText: PropTypes.string,
};
```

...and

```ts
// /app/components/Navbar.tsx

import Link from 'next/link';

import styles from '../../styles/Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav + ' container'}>
            <ul>
                <li>
                    <Link href="/public">Public page</Link>
                </li>

                <li>
                    <Link href="/protected">Protected page</Link>
                </li>

                <li>
                    <Link href="/admin">Admin page</Link>
                </li>

                <li>
                    <Link href="/register">Register</Link>
                </li>
            </ul>
        </nav>
    );
}
```

...and

```ts
// /app/components/Footer.tsx

import PropTypes from 'prop-types';
import Link from 'next/link';

import styles from '../../styles/Footer.module.css';

export default function Footer({ contactEmail }: { contactEmail: string | undefined }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerBody + ' container'}></div>
            <p className={styles.copyright}>&copy; 2022 next-with-auth</p>

            {contactEmail && (
                <address className="text-center">
                    Contact me at:<> </>
                    <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>
                </address>
            )}
        </footer>
    );
}

Footer.propTypes = {
    contactEmail: PropTypes.string,
};
```

---

## Linting rules and style guide

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

### Linting typescript

I had to supplement the above eslint config once I updated the app to typescript.

First, I installed the following packages:

```bash
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

I added some typescript overrides my **.eslintrc.json** file, but kept everything else the same. These will lint only on the .ts and .tsx files.

```json
"overrides": [
    {
        "files": [
            "**/*.ts",
            "**/*.tsx"
        ],
        "env": {
            "browser": true,
            "es6": true,
            "node": true
        },
        "extends": [
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended"
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "project": "./tsconfig.json"
        },
        "plugins": [
            "@typescript-eslint"
        ],
        "rules": {}
    }
],
```

---

## Setting up next-auth and a database

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

One necessary file for next-auth is **/pages/api/auth/\[...nextauth\].js**. This is where you set up your auth providers. In this app, I'm only using a **credentials provider** with a **username** and **password**. For this app, the file looks like this:

```js
// my original [...nextauth.js] file

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user';

export default NextAuth({
    providers: [
        Credentials({
            name: 'username/password',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                const { username, password } = credentials;
                const user = await getUserForSignin(username, password);

                // I'm adding user id, username and role to the user object... which need to also be added to the token and session below in the callback functions
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

...then after converting it to typescript:

```ts
// [...nextauth.ts]

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user';

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials) return null;

                const { username, password } = credentials;
                const user = await getUserForSignin(username, password);

                // I'm adding id, username and role to the user object... which need to also be added to the token and session below in the callback functions
                return user ? { id: user._id, name: user.username, role: user.role } : null;
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
            if (user?.id) token.id = user.id;
            if (user?.role) token.role = user.role;
            return token;
        },
        // I'm adding some extra properties to the session... this is where you must add them
        async session({ session, token }) {
            if (token.id && session.user) session.user.id = token.id;
            if (token.role && session.user) session.user.role = token.role;
            return session;
        },
    },
});
```

Once I converted \[...nextauth\].js to typescript (\[...nextauth\].ts), I had to add the following type declarations file to my **/types/next-auth.d.ts** folder (which includes accommodations for the additions I'm making to the token and session):

```ts
// next-auth.d.ts

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        role: string;
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
    }
}
```

Even though I like to use \_id when using mongodb and id when using a sql database, I decided to just use id with next-auth because the id field is included in the session by default and it would have been tricky to use \_id in its place. I'm still using \_id in front end pages and in the serverless components in this app.

Some things to note with the next-auth file:

-   If you want to save any other properties in the jwt or session, it must be done in the **callbacks** functions (jwt and session), plus edit the /types/next-auth.d.ts file if using typescript.
-   You can have more providers (eg: email or OAuth). They would get added to the **providers** array.

I added my standard **login**, **register** and **profile** pages.

Since an attempt to access a protected page would lead to a redirect to the login page, I've set the login page to monitor for a callbackUrl query parameter. That way, if the login is successful, the browser would redirect to the page the user was trying to go to in the first place.

There is also an array of possible callbackUrl query parameters that are bypassed upon a successful login. Those include: **/reset-link**, **/reset-password-success**, **/register** and the **/login** page itself. If any of these page are passed as the callbackUrl query parameter, the successful login redirect will send the user to the **homepage**. In fact, my check is to see if any of the redirect urls start with any of the _notRedirectable_ array items. This is because some of them (eg: /reset-link) will include query parameters so I can't just do an indexOf check on the array.

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

## I forgot my login info

On the login page, I've imported a **ForgotLoginInfo** component which allows users to retrieve their username or get a reset password link via email.

I've implemented NodeMailer to handle the emails. The configuration for NodeMailer is in: /lib/nodemailerConfig.ts and also in the .env file.

A user can have all usernames associated with the email address they enter emailed to them.

To receive a password reset link in an email, users need to enter both their username and email address. If both of these match a valid user, a resetPasswordToken field is created or updated in the database... along with a resetPasswordExpires field. Each request is valid for 60 minutes.

---

## Pages

There are 3 types of pages in this app.

1.  **Public** pages that can be viewed by anyone regardless of whether they are logged in. The homepage and public pages are examples of this type of page.
2.  **Protected** pages that can only be viewed by a logged in user. The protected and profile pages are examples of this type of page.
3.  **Admin** pages that can only be viewed by a user logged in with a role of admin. The admin page is an example of this type of page.

**Public pages**

I've upgraded to next.js version 13 and I'm using the new **/app** folder for all my pages. I'm taking advantage of their new Server Components as much as possible. As of 2023-01-13, this is an example of my old method of page construction. Notice that I'm calling a serverless function directly in page.js via an async function... and not using fetch.

```ts
// /app/public/page.tsx

import { getUnprotectedData } from '../../lib/api/index';

async function getData() {
    return await getUnprotectedData().catch((error) => console.log(error.message));
}

export default async function Page() {
    const data = await getData().catch((error) => console.log(error.message));

    return (
        <main id="main">
            <article>
                {/* had to add this nested fragment to get typescript to stop complaining about multiple children */}
                <>
                    <h2 className="page-heading">Public Page</h2>

                    <p>This page is getting data on the server-side, right in the component.</p>

                    {data && data.length > 0 && (
                        <ul>
                            {data.map((item) => (
                                <li key={item._id}>{item.name}</li>
                            ))}
                        </ul>
                    )}
                </>
            </article>
        </main>
    );
}
```

**Protected pages**

This is very similar to the public page, but checks for a session and redirects to the login page if it doesn't find one.

```ts
// /app/protected/page.tsx

import { redirect } from 'next/navigation';
import { getProtectedData } from '../../lib/api/index';
import { getServerSession } from 'next-auth/next';

async function getData() {
    return await getProtectedData().catch((error) => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/protected');
    }

    const data = await getData().catch((error) => console.log(error.message));

    return (
        <main id="main">
            <article>
                {/* had to add this nested fragment to get typescript to stop complaining about multiple children */}
                <>
                    <h2 className="page-heading">Protected Page</h2>

                    <p>This page is getting data on the server-side, right in the component.</p>

                    {data && data.length > 0 && (
                        <ul>
                            {data.map((item) => (
                                <li key={item._id}>{item.name + ' - age: ' + item.age}</li>
                            ))}
                        </ul>
                    )}
                </>
            </article>
        </main>
    );
}
```

---

**Pages protected by middleware**

The middleware does not allow anyone who is not authenticated to visit the page. The middleware sends the users to the login page (which handles the redirect back to the intended page upon successfully signing in).

**NOTE**: I'm currently not using middleware to protect any pages, because I feel next-auth is currently too buggy with middleware... though I did include a middleware.js file with a matcher in this project. It only contains a dummy route in the matcher though.

---

**Admin pages**

This page is very similar to the protected page... with the following exception:

-   I check for the role of the user before fetching data.
-   If the user is logged in, but doesn't have a role of "admin", I show an error message telling they lack credentials, but I don't redirect them.

```ts
// /app/admin/page.tsx

import { redirect } from 'next/navigation';
import { getAdminData } from '../../lib/api/index';
import { getServerSession } from 'next-auth/next';

async function getData() {
    return await getAdminData().catch((error) => console.log(error.message));
}

export default async function Page() {
    // doing this will return the session in the form of a token
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/admin');
    }

    let data = null;
    if (session.role === 'admin') {
        data = await getData().catch((error) => console.log(error.message));
    }

    return (
        <main id="main">
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
                        {data && data.length > 0 && (
                            <ul>
                                {data.map((item) => (
                                    <li key={item._id}>
                                        {item.name + ' - age: ' + item.age + ' (salary: $' + item.salary + ')'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </article>
        </main>
    );
}
```

When (if) the admin pages are protected by middleware, I tend to have the middleware redirect users to the homepage if they're signed in, but don't have the role of admin. Any user not signed in would obviously be redirected to the login page because they don't have a role at all yet.

---

## API Routes

There are 3 types of API routes in this app.

1.  **Public** routes that can be accessed by anyone regardless of whether they are logged in.
2.  **Protected** routes that can only be accessed by a logged in user (or in some cases, a specific logged in user... eg: update email, password and username routes).
3.  **Admin** routes that can only be accessed by a user logged in with a role of admin.

**NOTE**: the use of an explicit _return_ must be used with the response and status code if there is code that could still be run in the event that the above conditions are not met.

**Public API route**

```ts
// /pages/api/public.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUnprotectedData } from '../../lib/api';

export default async function publicRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    try {
        const response = await getUnprotectedData();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
```

**Protected API route**

Inside the async function are checks to make sure the following conditions are true (with a 401 status code being returned if they aren't):

1.  Check that the proper crud method is being used.
2.  Check that the user is logged via a token.

Only if the above conditions are met, the serverless function is called.

This is a sample of my typical protected API route.

```ts
// /pages/api/protected.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getProtectedData } from '../../lib/api';

export default async function protectedRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    const token = await getToken({ req });
    if (!token) return res.status(401).end();

    try {
        const response = await getProtectedData();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
```

Special protected API routes.

Some of my API routes required not only that a user is logged in, but that a certain user is logged in. The user.\_id in the token must match the query parameter user id.

This is an example of one of these special API routes (used to update a user's username).

```ts
// /pages/api/users/[_id]/change-username.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { changeUsername } from '../../../../lib/api/user';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(401).end();

    const token = await getToken({ req });
    if (!token) return res.status(401).end();
    if (!req.query.id || typeof req.query.id !== 'string' || !req.body.username) return res.status(400).end();
    if (token?.id !== req.query.id) return res.status(400).end();

    try {
        const response = await changeUsername(req.query.id, req.body.username);
        return response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}
```

**Admin API route**

This is an example of an admin api route where a user must be signed in and have the role of "admin".

```ts
// /pages/api/admin.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getAdminData } from '../../lib/api';

export default async function adminRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    const token = await getToken({ req });
    if (token?.role !== 'admin') return res.status(401).end();

    try {
        const response = await getAdminData();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
```

---

## Using signOut()

The only places I'm using the next-auth **signOut()** is in the **Authbar** and **UpdateProfile** components.

Normally, I don't redirect upon signing out because my pages are protected client-side and will automatically redirect to the login page if you're on a protected page when you sign out.

However, redirecting to the homepage upon signing out is useful when using middleware to protect a page because once you're on a protected page, the middleware by itself won't be able to take you away from it upon signing out.

For now, I'm redirecting to the homepage upon signOut().

```ts
// /components/Authbar.tsx

<Button onClick={() => signOut({ redirect: false })} size="small" variant="text">Logout</Button>

// or with logging out always sending you to the homepage

<Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="text">Logout</Button>
```

---

## Deploying to vercel

There were warnings in the build process on vercel concerning the node version needing to be v12, v14 or v16 and by default vercel uses v18. So, I downgraded vercel's node version to v16 and the warnings went away.

You need the **NEXTAUTH_URL** environment variable locally, but it's not needed if you deploy to vercel. Vercel will populate it itself as **VERCEL_URL**. You do need to make sure **Settings > Environment Variables > Automatically expose System Environment Variables** is checked.

---

## next/navigation

In next.js v13, **next/navigation** replaces **next/router** in the **/app** folder. You can still use _next/router_ in the _/pages_ folder.

```js
'use client';

import { useRouter } from 'next/navigation';

const router = useRouter();

// ...

if (status === 'unauthenticated') router.push('/login?callbackUrl=/protected');
```

To get the query params of the url, you have to use **useSearchParams**. This will get all the items after the ? and & symbols.

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

## getStaticProps and getServerSideProps replacements

**generateStaticParams** is the new getStaticPaths. I haven't implemented it yet, but hope to shortly.

To make a page static HTML (server or client component), you can do

```js
// generates statically like getStaticProps
fetch(URL, { cache: 'force-cache' });

// generates server-side upon every request like getServerSideProps
fetch(URL, { cache: 'no-store' });

// generates statically but revalidates every 20 seconds
fetch(URL, { next: { revalidate: 20 } });

// sets a revalidate time for any data fetching on the whole page
// this is the way you need to do it when you are accessing serverless functions directly and not using fetch
export const revalidate = 60;
```

**NOTE**: Using any of the above only works with a production build... not with a dev server.

---

## #\_\_next wrapping div

Next.js version 13 does not seem to use a wrapper div with the id of **\_\_next** like previous versions did. This had made the css for my full height pages stop working.

My fix was to add an id of **appWrapper** to the body tag in **/app/layout.tsx** which uses the same css as the old #\_\_next div.

```jsx
<body id="appWrapper">{/* ... */}</body>
```

---

## Todos

-   Write tests.
-   I'd like to come up with a way to clear button and nav focus on next/link page transition.
-   Decide what to name the page.js components (Page vs the name of the route folder).
-   Switch over from client fetch to swr for data fetching... for now at least. Using fetch to POST/DELETE seems fine though.
-   There is still a login redirect bug in middleware protected pages. Implement it when it's working better?
-   Why are my server-side console.logs not showing up?
-   Figure out optimized typescript-eslint config?
-   Should I be closing the mongodb connection after use in serverless functions?
-   Upgrade to mongodb v5.0.0?
-   Switch the database to my other account.

---

![next-with-auth](next_with_auth.svg 'next-with-auth')
![by Mike Gullo](author.svg 'by Mike Gullo')

-   Live version: https://next-with-auth.vercel.app/
-   This project's github repo: https://github.com/mike14747/next-with-auth
-   Me on github: https://github.com/mike14747
-   Contact me at: mgullo.dev@gmail.com

![GitHub last commit](https://img.shields.io/github/last-commit/mike14747/next-with-auth?style=for-the-badge)
