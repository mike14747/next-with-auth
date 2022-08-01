import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        // to make the header full width, just omit the container class
        <div className={styles.header + ' container'}>
            <p>This is the Header component.</p>
        </div>
    );
}
