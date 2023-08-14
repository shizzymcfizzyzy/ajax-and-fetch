const VALID_EMAIL_ENDINGS = [
  "gmail.com",
  "GMAIL.COM",
  "outlook.com",
  "yandex.ru",
];
const isValid = (email) => {
  for (const endingEl of VALID_EMAIL_ENDINGS) {
    if (email.endsWith(endingEl)) {
      return true;
    }
  }
  return false;
};
export default isValid;
function validate(email) {
  return isValid(email);
}
async function validateAsync(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(validate(email));
    }, 1000);
  });
}
function validateWithThrow(email) {
  if (!validate(email)) {
    throw new Error("Invalid email: " + email);
  }
  return true;
}
function validateWithLog(email) {
  const isValid = validate(email);
  console.log(`Email "${email}" is ${isValid ? "valid" : "invalid"}`);
  return isValid;
}
export { validate, validateAsync, validateWithThrow, validateWithLog };
