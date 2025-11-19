import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '15m') as string;
  // @ts-ignore
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;
  // @ts-ignore
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') as { userId: string };
};
