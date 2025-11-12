import { Parser } from '@pgsql/parser';
import bcrypt from 'bcryptjs';

export function isNumeric(value: any): boolean {
  return typeof value === 'number'
    ? !isNaN(value)
    : typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(
  password: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function isSelectQuery(sql: string): Promise<boolean> {
  const parser = new Parser({ version: 16 });
  try {
    const result = await parser.parse(sql);

    for (const stmt of result.stmts) {
      if (
        !stmt.stmt ||
        typeof stmt.stmt !== 'object' ||
        !('SelectStmt' in stmt.stmt)
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
