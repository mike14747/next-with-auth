import Link from 'next/link';

import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav + ' container'}>
            <ul>
                <li>
                    <Link href="/test">
                        Test
                    </Link>
                </li>

                <li>
                    <Link href="/public">
                        Public page
                    </Link>
                </li>

                <li>
                    <Link href="/protected">
                        Protected page
                    </Link>
                </li>

                <li>
                    <Link href="/admin">
                        Admin page
                    </Link>
                </li>

                <li>
                    <Link href="/register">
                        Register
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
