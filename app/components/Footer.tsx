import Link from 'next/link';

import styles from '@/styles/Footer.module.css';

export default function Footer({ contactEmail }: { contactEmail: string | undefined }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerBody + ' container'}>

            </div>
            <p className={styles.copyright}>&copy; 2022 next-with-auth</p>

            {contactEmail &&
                <address className="text-center">
                    Contact me at:<> </>
                    <Link href={`mailto:${contactEmail}`}>
                        {contactEmail}
                    </Link>
                </address>
            }
        </footer>
    );
}
