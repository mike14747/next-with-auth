import PropTypes from 'prop-types';
import { ChangeEventHandler } from 'react';

import styles from '../../styles/FormInput.module.css';

type FormInputProps = {
    id: string;
    label?: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    errorMsg?: string;
    required?: boolean;
    size?: 'small' | 'normal';
    type?: 'text' | 'number' | 'password' | 'date' | 'email' | 'tel' | 'url' | 'time' | 'checkbox';
    placeholder?: string;
    pattern?: string;
    step?: string;
    checked?: boolean;
    value?: string;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
}

const sizes = ['small', 'normal'];

export default function FormInput({ id, label = '', handleChange, errorMsg = '', required = false, size = 'normal', type = 'text', placeholder = '', ...rest }: FormInputProps) {
    const inputSize = sizes?.includes(size) ? size : 'normal';

    const { checked } = { ...rest };

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={id} className={`${styles.label} ${styles[inputSize]} ${type === 'checkbox' ? styles.labelCheckbox : ''}`}>
                {label}

                {/* you can comment out the following line if you don't want to notify the user of fields that are required */}
                {required && <span className={styles.required}>*required</span>}
            </label>

            <input
                id={id}
                className={`${styles.input} ${styles[inputSize]}`}
                onChange={handleChange}
                required={required}
                size={30}
                type={type}
                placeholder={placeholder}
                {...rest}
            />

            {type === 'checkbox' &&
                <div role="checkbox" aria-checked={checked || false} tabIndex={0} aria-labelledby={label} className={styles.fakeCheckbox}></div>
            }

            {errorMsg &&
                <p className={styles.errorMessage}>{errorMsg}</p>
            }
        </div>
    );
}

FormInput.propTypes = {
    id: (props: FormInputProps) => props?.label?.length || 0 > 0 && (!props.id || typeof props.id !== 'string') && new Error('id is needed and must be in the proper format when a label is present'),
    label: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    required: PropTypes.bool,
    size: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'text',
        'number',
        'password',
        'date',
        'email',
        'tel',
        'url',
        'time',
        'checkbox',
    ]),
    placeholder: PropTypes.string,
    // ...rest are below
    pattern: PropTypes.string,
    step: PropTypes.string,
    checked: PropTypes.bool,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
};
