const VALID_EMAIL_ENDINGS = [
  "gmail.com",
  "GMAIL.COM",
  "outlook.com",
  "yandex.ru",
];
const isValid = (email) => {
  for (const endingEl of VALID_EMAIL_ENDINGS) {
    // eslint-disable-next-line no-restricted-syntax
    if (email.endsWith(endingEl)) {
      return true;
    }
  }
  return false;
};
export default isValid;
