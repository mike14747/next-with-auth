import { MutableRefObject, ChangeEvent } from 'react';
import FormInput from '@/components/FormInput';
import { passwordPattern, passwordErrorMsg } from '@/lib/formInputPatterns';

export default function FormInputForNewPassword({ password, repeatPassword }: { password: MutableRefObject<string>, repeatPassword: MutableRefObject<string> }) {
    return (
        <>
            <FormInput
                id="password"
                label="Password"
                name="password"
                type="password"
                required={true}
                handleChange={(e: ChangeEvent<HTMLInputElement>) => password.current = e.target.value}
                pattern={passwordPattern}
                errorMsg={passwordErrorMsg}
            />

            <FormInput
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                required={true}
                handleChange={(e: ChangeEvent<HTMLInputElement>) => repeatPassword.current = e.target.value}
                pattern={passwordPattern}
                errorMsg={passwordErrorMsg}
            />
        </>
    );
}
