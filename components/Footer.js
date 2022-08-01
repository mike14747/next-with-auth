import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        // to make the footer full width, just omit the container class
        <div className={styles.footer + ' container'}>
            <p>This is the Footer component.</p>
        </div>
    );
}
