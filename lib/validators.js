// Email Validator
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone Number Validator
export const isValidPhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

// Password Validator (min 6 characters)
export const isStrongPassword = (password) => {
  return password && password.length >= 6;
};

// URL Validator
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Number Validator
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

// Postal Code Validator (US format)
export const isValidPostalCode = (code) => {
  const regex = /^\d{5}(-\d{4})?$/;
  return regex.test(code);
};

// Credit Card Validator (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Required Field Validator
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

// Min Length Validator
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Max Length Validator
export const maxLength = (value, max) => {
  return !value || value.length <= max;
};
