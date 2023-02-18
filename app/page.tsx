'use client';

type HomepageProps = {
    params: {
        numInitialNewsItems: number;
        newsItemIncrement: number;
    }
}

export default function Homepage({ params }: HomepageProps) {
    return (
        <>
            <aside>
                <p>
                    <small>
                        Items passed from the RootLayout to children (the pages) via props: <strong>{params.numInitialNewsItems}</strong> and <strong>{params.newsItemIncrement}</strong>
                    </small>
                </p>
            </aside>

            <main id="main">
                <article>
                    <p>
                        This is the homepage in the app folder.
                    </p>
                </article>

            </main>
        </>

    );
}
