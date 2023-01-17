import PropTypes from 'prop-types';
import FormInput from './FormInput';
import { passwordPattern, passwordErrorMsg, repeatPassordErrorMsg } from '../../lib/formInputPatterns';

export default function FormInputForNewPassword({ password, repeatPassword }) {
    return (
        <>
            <FormInput
                id="password"
                label="Password"
                name="password"
                type="password"
                required={true}
                onChange={(e) => password.current = e.target.value}
                pattern={passwordPattern}
                errorMsg={passwordErrorMsg}
            />

            <FormInput
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                required={true}
                onChange={(e) => repeatPassword.current = e.target.value}
                pattern={passwordPattern}
                errorMsg={repeatPassordErrorMsg}
            />
        </>
    );
}
FormInputForNewPassword.propTypes = {
    password: PropTypes.object,
    repeatPassword: PropTypes.object,
};
