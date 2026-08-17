import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const withValidationErrors = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map((error) => error.msg);
        return res.status(400).json({ message: messages[0] });
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('name is required'),
  body('lastName').trim().notEmpty().withMessage('last name is required'),
  body('location').trim().notEmpty().withMessage('location is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('email already exists');
      }
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .notEmpty()
    .withMessage('password is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
]);
