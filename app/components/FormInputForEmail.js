import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { emailPattern, emailErrorMsg } from '../../lib/formInputPatterns';

export default function FormInputForEmail({ email }) {
    return (
        <FormInput
            id="email"
            label="Email"
            name="email"
            type="email"
            required={true}
            onChange={e => email.current = e.target.value}
            pattern={emailPattern}
            errorMsg={emailErrorMsg}
        />
    );
}

FormInputForEmail.propTypes = {
    email: PropTypes.object,
};
