import { MutableRefObject, ChangeEvent } from 'react';
import FormInput from './FormInput';
import { usernamePattern, usernameErrorMsg } from '../../lib/formInputPatterns';

export default function FormInputForUsername({ username }: { username: MutableRefObject<string> }) {
    return (
        <FormInput
            id="username"
            label="Username"
            name="username"
            type="text"
            required={true}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => username.current = e.target.value}
            pattern={usernamePattern}
            errorMsg={usernameErrorMsg}
        />
    );
}
