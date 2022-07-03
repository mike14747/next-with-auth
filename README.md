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

            <main className="main-container">
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

**/pages/_app.js**

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

**/pages/_document.js**

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

### Setting up next-auth

### Linting rules and style guide
