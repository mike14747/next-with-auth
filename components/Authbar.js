import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Button from '../components/Button';

import styles from '../styles/Authbar.module.css';

const Authbar = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();

    return (
        <section className={styles.authbarContainer}>
            {loading && <>Loading...</>}

            {!session && !loading &&
                <p>
                    <Link href={`/login?callbackUrl=${router.pathname}`}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>Login</a>
                    </Link>

                    <span>&nbsp;/&nbsp;</span>

                    <Link href={'/register'}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>Register</a>
                    </Link>
                </p>
            }

            {session &&
                <>
                    <p className={styles.username}>
                        <>User: </>
                        <Link href="/profile">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a>
                                {session.user.name}
                            </a>
                        </Link>
                    </p>

                    {/* <Button onClick={() => signOut({ redirect: false })} size="small" variant="text">Logout</Button> */}
                    <Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="text">Logout</Button>
                </>
            }
        </section>
    );
};

export default Authbar;
