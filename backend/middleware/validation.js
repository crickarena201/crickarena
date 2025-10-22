import { body, validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors', { 
      errors: errors.array(), 
      url: req.url, 
      method: req.method 
    });
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
export const validateClubRegistration = [
  body('clubName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Club name must be between 3 and 100 characters')
    .escape(),
  
  body('district')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('District is required and must be less than 50 characters')
    .escape(),
  
  body('city')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('City is required and must be less than 50 characters')
    .escape(),
  
  body('managerName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Manager name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Manager name contains invalid characters')
    .escape(),
  
  body('phone')
    .trim()
    .matches(/^(\+91[\s-]?)?[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian phone number'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('foundedYear')
    .optional()
    .isInt({ min: 1850, max: new Date().getFullYear() })
    .withMessage(`Founded year must be between 1850 and ${new Date().getFullYear()}`),
  
  body('memberCount')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Member count must be between 1 and 10000'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid URL'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .escape(),
  
  body('groundName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Ground name must be less than 100 characters')
    .escape(),
  
  body('achievements')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Achievements must be less than 1000 characters')
    .escape(),
  
  handleValidationErrors
];

export const validateTournamentRegistration = [
  body('tournamentId')
    .trim()
    .isMongoId()
    .withMessage('Invalid tournament ID'),
  
  handleValidationErrors
];

export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name contains invalid characters')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .isIn(['public', 'clubManager', 'player', 'coach'])
    .withMessage('Role must be one of public, clubManager, player, or coach'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  
  handleValidationErrors
];