import Head from 'next/head';

const NoMatch = () => {
    return (
        <>
            <Head>
                <title>Page Not Found</title>
            </Head>

            <article id="no-match">
                <h2 className="error">
                    Error 404!
                </h2>

                <p>An error has occurred.</p>
                <p>The page you are looking for does not exist!</p>
                <style jsx>{`
                    #no-match {
                        margin: 1.5rem auto;
                        max-width: 80ch;
                    }

                    p {
                        font-size: clamp(1rem, 0.55vw + 0.55rem, 1.2rem);
                    }

                    .error {
                        font-size: clamp(1.4rem, 1vw + 0.9rem, 2.1rem);
                        color: var(--mg-red);
                        margin-bottom: 1rem;
                    }
                `}</style>
            </article>
        </>
    );
};

export default NoMatch;
