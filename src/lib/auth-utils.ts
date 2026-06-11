import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { db } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserFromRequest(request: NextRequest | Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId || userId.trim() === '') return null;
  const user = await db.user.findUnique({
    where: { id: userId.trim() },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
}
