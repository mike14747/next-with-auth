// eslint-disable-next-line quotes
export const usernamePattern = "^(?=.{4,15}$)[a-zA-Z0-9]+(?:[_\\-][a-zA-Z0-9]+)*$";
export const usernameErrorMsg = 'Username must be from 4 to 15 characters in length and not include any special characters other than dashes and underscores (but only 1 can be used consecutively). Must start and end with a letter or number.';

// eslint-disable-next-line quotes
export const passwordPattern = "^[a-zA-Z0-9.!#$%&'*+=?^_`~\\{\\|\\}\\/\\-]{8,20}$";
export const passwordErrorMsg = 'Password must be from 8 to 20 characters in length.';
export const repeatPassordErrorMsg = 'Passwords do not match.';

// eslint-disable-next-line quotes
export const emailPattern = "^(?:[a-zA-Z0-9.!#$%&'*+=?^_`~\\{\\|\\}\\/\\-]){1,64}@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)+$";
export const emailErrorMsg = 'Please enter a valid email address.';
