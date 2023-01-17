import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { usernamePattern, usernameErrorMsg } from '../../lib/formInputPatterns';

export default function FormInputForUsername({ username }) {
    return (
        <FormInput
            id="username"
            label="Username"
            name="username"
            type="text"
            required={true}
            handleChange={(e) => username.current = e.target.value}
            pattern={usernamePattern}
            errorMsg={usernameErrorMsg}
        />
    );
}
FormInputForUsername.propTypes = {
    username: PropTypes.object,
};
