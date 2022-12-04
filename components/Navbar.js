import Link from 'next/link';

import styles from '../styles/Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav + ' container'}>
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
        </nav>
    );
}
