import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { passwordPattern, passwordErrorMsg, repeatPassordErrorMsg } from '../lib/formInputPatterns';

export default function FormInputForNewPassword({ password, setPassword, repeatPassword, setRepeatPassword }) {
    return (
        <>
            <FormInput
                id="password"
                label="Password"
                name="password"
                type="password"
                value={password}
                required={true}
                handleChange={(e) => setPassword(e.target.value)}
                pattern={passwordPattern}
                errorMsg={passwordErrorMsg}
            />

            <FormInput
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                value={repeatPassword}
                required={true}
                handleChange={(e) => setRepeatPassword(e.target.value)}
                pattern={password}
                errorMsg={repeatPassordErrorMsg}
            />
        </>
    );
}
FormInputForNewPassword.propTypes = {
    password: PropTypes.string,
    setPassword: PropTypes.func,
    repeatPassword: PropTypes.string,
    setRepeatPassword: PropTypes.func,
};
