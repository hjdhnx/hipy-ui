export function generateRandomDigit(minDigits, maxDigits) {
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
