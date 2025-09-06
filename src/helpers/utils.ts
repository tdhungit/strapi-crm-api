export function isNumeric(value: any): boolean {
  return typeof value === 'number'
    ? !isNaN(value)
    : typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));
}
