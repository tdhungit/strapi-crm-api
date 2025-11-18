import { Parser } from '@pgsql/parser';
import { ParseResult } from '@pgsql/parser/wasm/v16/types';
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

export async function parseSql(sql: string): Promise<ParseResult> {
  const parser = new Parser({ version: 16 });
  try {
    const result = await parser.parse(sql);
    return result;
  } catch (error) {
    throw new Error(`Failed to parse SQL: ${error}`);
  }
}

export async function isSelectQuery(sql: string): Promise<boolean> {
  try {
    const result = await parseSql(sql);

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
