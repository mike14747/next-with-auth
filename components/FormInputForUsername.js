import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { usernamePattern, usernameErrorMsg } from '../lib/formInputPatterns';

export default function FormInputForUsername({ username, setUsername }) {
    return (
        <FormInput
            id="username"
            label="Username"
            name="username"
            type="text"
            value={username}
            required={true}
            handleChange={(e) => setUsername(e.target.value)}
            pattern={usernamePattern}
            errorMsg={usernameErrorMsg}
        />
    );
}
FormInputForUsername.propTypes = {
    username: PropTypes.string,
    setUsername: PropTypes.func,
};
