import PropTypes from 'prop-types';

import styles from '../styles/FormInput.module.css';

const sizes = ['small', 'normal'];

export default function FormInput({ id, label, handleChange, errorMsg, required, size, type, ...rest }) {
    const inputSize = sizes?.includes(size) ? size : 'normal';

    const { checked } = { ...rest };

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={id} className={`${styles.label} ${styles[inputSize]} ${type === 'checkbox' ? styles.labelCheckbox : ''}`}>
                {label}

                {/* you can disable the following line if you don't want to notify the user of fields that are required */}
                {required && <span className={styles.required}>*required</span>}
            </label>

            <input
                id={id}
                className={`${styles.input} ${styles[inputSize]}`}
                onChange={handleChange}
                required={required}
                size="30"
                type={type}
                {...rest}
            />

            {type === 'checkbox' &&
                <div role="checkbox" aria-checked={checked || false} tabIndex="0" aria-labelledby={label} className={styles.fakeCheckbox}></div>
            }

            {errorMsg &&
                <p className={styles.errorMessage}>{errorMsg}</p>
            }
        </div>
    );
}

FormInput.propTypes = {
    id: (props) => props?.label?.length > 0 && (!props.id || (typeof props.id !== 'string' && typeof props.id !== 'number')) && new Error('id is needed and must be in the proper format when a label is present'),
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
    pattern: PropTypes.string,
    step: PropTypes.string,
    checked: PropTypes.bool,
};

FormInput.defaultProps = {
    id: null,
    label: '',
    required: null,
    type: 'text',
    placeholder: '',
    size: 'normal',
    errorMsg: '',
    pattern: null,
    step: null,
    checked: null,
};
