/**
 * Validation utilities for form validation
 */

// Common password patterns to reject
export const commonPasswords = [
  'password', '123456', 'password123', 'admin', 'qwerty', 'letmein',
  '123456789', 'welcome', 'monkey', '1234567890', '123123', 'password1',
  'abc123', '111111', 'iloveyou', 'adobe123', '123321', 'solo', 'sunshine'
];

// Disposable email domains to block
export const disposableEmailDomains = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc', 'yopmail.com',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz'
];

/**
 * Validate email address with comprehensive checks
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  // RFC 5322-like local@domain check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!trimmedEmail) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  const domain = trimmedEmail.split('@')[1];
  
  // Enforce at least one dot in domain and a letter-only TLD (e.g., .com, .net)
  const parts = domain.split('.');
  if (parts.length < 2) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  const tld = parts[parts.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (disposableEmailDomains.includes(domain)) {
    return { isValid: false, error: 'Please use a permanent email address, not a disposable one' };
  }
  
  return { isValid: true, error: '', cleanEmail: trimmedEmail };
}

/**
 * Validate name with comprehensive checks
 * @param {string} name - Name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validateName(name) {
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Full name is required' };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, error: '', cleanName: trimmedName };
}

/**
 * Validate password with comprehensive security checks
 * @param {string} password - Password to validate
 * @param {string} name - User's name to check against
 * @returns {Object} - { isValid: boolean, error: string, criteria: object }
 */
export function validatePassword(password, name = '') {
  const criteria = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  if (!password) {
    return { isValid: false, error: 'Password is required', criteria };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long', criteria };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters', criteria };
  }
  
  if (!criteria.hasUppercase) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter', criteria };
  }
  
  if (!criteria.hasLowercase) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter', criteria };
  }
  
  if (!criteria.hasNumber) {
    return { isValid: false, error: 'Password must contain at least one number', criteria };
  }
  
  if (!criteria.hasSpecial) {
    return { isValid: false, error: 'Password must contain at least one special character', criteria };
  }
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Please choose a more secure password', criteria };
  }
  
  
  return { isValid: true, error: '', criteria };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: '' };
}

/**
 * Validate role selection
 * @param {string} role - Role to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validateRole(role) {
  const allowedRoles = ['public', 'clubManager', 'player', 'coach'];
  
  if (!role) {
    return { isValid: false, error: 'Please select a role' };
  }
  
  if (!allowedRoles.includes(role)) {
    return { isValid: false, error: 'Please select a valid role' };
  }
  
  return { isValid: true, error: '' };
}

/**
 * Validate Indian mobile number
 * @param {string} phone - Phone number to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validatePhone(phone) {
  const trimmedPhone = phone.trim();
  
  if (!trimmedPhone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove spaces, hyphens, and plus sign for validation
  const cleanPhone = trimmedPhone.replace(/[\s-]/g, '');
  
  // Indian mobile number patterns:
  // With country code: +919876543210 or 919876543210
  // Without country code: 9876543210
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Phone number must be 10 digits' };
    }
    if (cleanPhone.length > 13) {
      return { isValid: false, error: 'Phone number is too long' };
    }
    if (!/^(\+91|91)?[0-9]+$/.test(cleanPhone)) {
      return { isValid: false, error: 'Phone number can only contain digits, +, -, and spaces' };
    }
    if (!/^(\+91|91)?[6-9]/.test(cleanPhone)) {
      return { isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9' };
    }
    return { isValid: false, error: 'Please enter a valid Indian mobile number' };
  }
  
  return { isValid: true, error: '', cleanPhone };
}

/**
 * Validate Indian pincode
 * @param {string} pincode - Pincode to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validatePincode(pincode) {
  const trimmedPincode = pincode.trim();
  
  if (!trimmedPincode) {
    return { isValid: false, error: 'Pincode is required' };
  }
  
  // Remove spaces for validation
  const cleanPincode = trimmedPincode.replace(/\s/g, '');
  
  // Must be exactly 6 digits
  const pincodeRegex = /^\d{6}$/;
  
  if (!pincodeRegex.test(cleanPincode)) {
    if (!/^\d+$/.test(cleanPincode)) {
      return { isValid: false, error: 'Pincode must contain only numbers' };
    }
    if (cleanPincode.length < 6) {
      return { isValid: false, error: 'Pincode must be exactly 6 digits' };
    }
    if (cleanPincode.length > 6) {
      return { isValid: false, error: 'Pincode cannot be more than 6 digits' };
    }
    return { isValid: false, error: 'Please enter a valid 6-digit pincode' };
  }
  
  return { isValid: true, error: '', cleanPincode };
}

/**
 * Check if all validation criteria are met
 * @param {...Object} validations - Validation objects to check
 * @returns {boolean} - True if all validations pass
 */
export function allValid(...validations) {
  return validations.every(validation => validation.isValid);
}