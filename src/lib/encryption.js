import CryptoJS from 'crypto-js';

export function generateEncryptionKey(masterPassword, salt) {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
}

export function encryptData(data, encryptionKey) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

export function decryptData(encryptedData, encryptionKey) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

export function generatePassword(options) {
  const {
    length = 16,
    includeNumbers = true,
    includeSymbols = true,
    includeUppercase = true,
    includeLowercase = true,
    excludeSimilar = false
  } = options;

  let charset = '';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const similarChars = 'il1Lo0O';

  if (includeLowercase) charset += lowercase;
  if (includeUppercase) charset += uppercase;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  if (excludeSimilar) {
    charset = charset.split('')
      .filter(char => !similarChars.includes(char))
      .join('');
  }

  let password = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}

// Utility function to check password strength
export function checkPasswordStrength(password) {
  if (!password) return { score: 0, feedback: 'Password is empty' };

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length < 8) {
    feedback.push('Password is too short');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Common patterns check
  const commonPatterns = [
    /^[A-Za-z]+\d+$/,  // Only letters followed by numbers
    /^[A-Za-z]+$/,     // Only letters
    /^\d+$/,           // Only numbers
    /(.)\1{2,}/        // Character repetition
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 1;
      feedback.push('Password contains common patterns');
      break;
    }
  }

  // Common substitutions check
  const commonSubs = {
    'a': '@',
    'i': '1',
    'o': '0',
    's': '$'
  };

  let hasCommonSubs = false;
  for (const [letter, sub] of Object.entries(commonSubs)) {
    const pattern = new RegExp(sub, 'i');
    if (pattern.test(password)) {
      hasCommonSubs = true;
      break;
    }
  }

  if (hasCommonSubs) {
    score -= 1;
    feedback.push('Password uses common character substitutions');
  }

  // Normalize score to 0-4 range
  score = Math.max(0, Math.min(4, score));

  // Final feedback based on score
  if (score === 4) feedback.unshift('Password is very strong');
  else if (score === 3) feedback.unshift('Password is strong');
  else if (score === 2) feedback.unshift('Password is moderate');
  else if (score === 1) feedback.unshift('Password is weak');
  else feedback.unshift('Password is very weak');

  return {
    score,
    feedback: feedback.join('. ')
  };
}