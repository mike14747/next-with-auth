# next-with-auth

This is my reference app for creating a next.js app using next-auth.

It includes public and protected pages.

It includes public and protected api routes.

It even has different levels of access for the private routes (user vs admin).

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

### Setting up next-auth and a database

I opted for and installed **mongodb** along with **next-auth** instead of going with an sql database because hosting a remote database on Atlas is free for a low usage app like this one.

```bash
npm i next-auth mongodb
```

Setting up the database on **Atlas** and adding that connection info to my **.env** (as MONGODB_URI and MONGODB_DB values) was next up.

Then there is the database connection file (/lib/mongodb.js). This will be imported by any serverless function that needs to query the remote database.



### I forgot my login info

