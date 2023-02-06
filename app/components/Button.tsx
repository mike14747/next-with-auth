import PropTypes from 'prop-types';
import { ReactNode, MouseEventHandler } from 'react';

import styles from '../../styles/Button.module.css';

type ButtonProps = {
    children: ReactNode;
    size?: 'small' | 'medium' | 'large' | 'specialSize';
    variant?: 'outlined' | 'text' | 'contained' | 'special';
    type?: 'button' | 'submit' | 'reset';
    theme?: 'primary' | 'secondary' | 'danger';
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const sizes = ['small', 'medium', 'large', 'specialSize'];
const variants = ['outlined', 'text', 'contained', 'special'];
const types = ['button', 'submit', 'reset'];
const themes = ['primary', 'secondary', 'danger'];

export default function Button({ children, size = 'medium', variant = 'contained', type = 'button', theme = 'primary', onClick }: ButtonProps) {
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
    onClick: (props: ButtonProps) => props.type !== 'submit' && typeof (props.onClick) !== 'function' && new Error('onClick function is required unless the button type is submit!'),
};
