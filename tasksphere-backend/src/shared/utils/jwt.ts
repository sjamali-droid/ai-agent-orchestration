import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ACCESS_EXPIRES_SEC = parseInt(process.env.JWT_ACCESS_EXPIRES_SEC || '900', 10);
const REFRESH_EXPIRES_SEC = parseInt(process.env.JWT_REFRESH_EXPIRES_SEC || '604800', 10);

export function signAccessToken(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: ACCESS_EXPIRES_SEC };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function signRefreshToken(payload: { userId: string }): string {
  const opts: SignOptions = { expiresIn: REFRESH_EXPIRES_SEC };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
