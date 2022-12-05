import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* <link rel="icon" href="data:," /> */}
                    <link rel="icon" type="image/png" href="/images/next_with_auth_favicon-16x16.png" sizes="16x16" />
                    <link rel="icon" type="image/png" href="/images/next_with_auth_favicon-32x32.png" sizes="32x32" />
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
