import PropTypes from 'prop-types';

import styles from '../styles/Button.module.css';

const sizes = ['small', 'medium', 'large', 'specialSize'];
const variants = ['outlined', 'text', 'contained', 'special'];
const types = ['button', 'submit', 'reset'];
const themes = ['primary', 'secondary', 'danger'];

export default function Button({ children, size, variant, type, theme, onClick }) {
    const btnSize = sizes.includes(size) ? size : 'medium';
    const btnVariant = variants.includes(variant) ? variant : 'contained';
    const btnType = types.includes(type) ? type : 'button';
    const btnTheme = themes.includes(theme) ? theme : 'primary';

    return (
        <button
            onClick={onClick}
            type={btnType}
            className={`${styles.btn} ${styles[`${btnSize}`]} ${styles[`${btnVariant}`]} ${styles[`${btnTheme}`]}`}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    size: PropTypes.string,
    variant: PropTypes.string,
    type: PropTypes.string,
    theme: PropTypes.string,
    onClick: (props) => props.type !== 'submit' && typeof (props.onClick) !== 'function' && new Error('onClick function is required unless the button type is submit!'),
};

Button.defaultProps = {
    size: 'medium',
    variant: 'contained',
    type: 'button',
    theme: 'primary',
    onClick: null,
};
