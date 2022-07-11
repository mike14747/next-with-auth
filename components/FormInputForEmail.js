import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { emailPattern, emailErrorMsg } from '../lib/formInputPatterns';

export default function FormInputForEmail({ email, setEmail }) {
    return (
        <FormInput
            id="email"
            label="Email"
            name="email"
            type="email"
            value={email}
            required={true}
            handleChange={(e) => setEmail(e.target.value)}
            pattern={emailPattern}
            errorMsg={emailErrorMsg}
        />
    );
}

FormInputForEmail.propTypes = {
    email: PropTypes.string,
    setEmail: PropTypes.func,
};
