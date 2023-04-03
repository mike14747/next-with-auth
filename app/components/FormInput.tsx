import { ChangeEventHandler } from 'react';

import styles from '../../styles/FormInput.module.css';

type FormInputProps = {
    id: string;
    label?: string;
    name: string;
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

export default function FormInput({ id, label = '', name, handleChange, errorMsg = '', required = false, size = 'normal', type = 'text', placeholder = '', ...rest }: FormInputProps) {
    const inputSize = sizes?.includes(size) ? size : 'normal';

    const { checked } = { ...rest };

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={id} className={`${styles.label} ${styles[inputSize]} ${type === 'checkbox' ? styles.labelCheckbox : ''}`}>
                {label}

                {/* you can comment out the following line if you don't want to notify the user of fields that are required */}
                {required && <span className={styles.required}>*required</span>}

                <input
                    id={id}
                    name={name}
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
            </label>

            {errorMsg &&
                <p className={styles.errorMessage}>{errorMsg}</p>
            }
        </div>
    );
}
