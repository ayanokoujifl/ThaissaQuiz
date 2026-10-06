import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'thaissa_quiz_admin';

export function getExpectedToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_thaissa_2026';
  const key = process.env.ADMIN_ACCESS_KEY || 'thaissa2026';
  return crypto.createHmac('sha256', secret).update(key).digest('hex');
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === getExpectedToken();
}

export function validateAdminPassword(password: string): boolean {
  const adminKey = process.env.ADMIN_ACCESS_KEY || 'thaissa2026';
  return password.trim() === adminKey.trim();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
