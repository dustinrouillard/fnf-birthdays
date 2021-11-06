import { verify } from 'jsonwebtoken';

export function validate(token: string): boolean {
  try {
    const valid = verify(token, INTERNAL_SECRET, { issuer: 'dstn.to' });

    if (!valid) return false;
    return true;
  } catch (error) {
    return false;
  }
}