import styles from '../../styles/Footer.module.css';

export default function Footer() {
    return (
        // to make the footer full width, just omit the container class
        <footer className={styles.footer}>
            <p className={styles.copyright}>&copy; 2022 next-with-auth</p>
        </footer>
    );
}
