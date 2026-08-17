import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createJWT = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const { name, lastName, email, password, location } = req.body;

  const isFirstUser = (await User.countDocuments()) === 0;
  const user = await User.create({
    name,
    lastName,
    email,
    password,
    location,
    role: isFirstUser ? 'admin' : 'user',
  });

  const token = createJWT(user);
  setTokenCookie(res, token);

  res.status(201).json({
    message: 'User created successfully',
    user: {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      role: user.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const token = createJWT(user);
  setTokenCookie(res, token);

  res.status(200).json({
    message: 'User logged in successfully',
    user: {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      role: user.role,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedFields = ['name', 'lastName', 'email', 'location'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.status(200).json({
      message: 'User updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
