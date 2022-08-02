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

For starters, let's populate just the files necessary to run the app.

**/components/Layout.js**

```js
import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Header />

            <main className="main-container">{children}</main>

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

The **Header** and **Footer** are just basic functional components that output "This is the xxx component." text... eg:

```js
export default function Header() {
    return (
        <>
            <p>This is the Header component.</p>
        </>
    );
}
```

I haven't added my custom **ScrollTop** component to this app, but it could easily be included, then imported into Layout.js so it would be part of each page.

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

import { getUserForSignin } from '../../../lib/api';

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

---

### Protected pages

