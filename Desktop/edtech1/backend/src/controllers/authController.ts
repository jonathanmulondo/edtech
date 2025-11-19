import { Request, Response } from 'express';
import { User } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      email,
      username,
      passwordHash,
      emailVerified: true
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatarUrl } = req.body;
    const user = await User.findByPk(req.user!.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
