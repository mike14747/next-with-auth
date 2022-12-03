import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Head>
                <title>Homepage</title>
            </Head>

            <p>
                This is the Homepage.
            </p>

            <ul>
                <li>
                    <Link href="/public">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Public page
                        </a>

                    </Link>
                </li>

                <li>
                    <Link href="/protected">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Protected page
                        </a>

                    </Link>
                </li>

                <li>
                    <Link href="/protected2">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Protected by middleware page
                        </a>

                    </Link>
                </li>

                <li>
                    <Link href="/admin">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Admin page
                        </a>

                    </Link>
                </li>

                <li>
                    <Link href="/register">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Register
                        </a>

                    </Link>
                </li>
            </ul>
        </>
    );
}
