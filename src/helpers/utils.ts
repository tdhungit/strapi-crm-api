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
