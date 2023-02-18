'use client';

import { MutableRefObject, ChangeEvent } from 'react';
import FormInput from './FormInput';
import { emailPattern, emailErrorMsg } from '../../lib/formInputPatterns';

export default function FormInputForEmail({ email }: { email: MutableRefObject<string> }) {
    return (
        <FormInput
            id="email"
            label="Email"
            name="email"
            type="email"
            required={true}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => email.current = e.target.value}
            pattern={emailPattern}
            errorMsg={emailErrorMsg}
        />
    );
}
