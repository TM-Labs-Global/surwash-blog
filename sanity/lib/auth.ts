export const APPROVED_ADMIN_EMAILS = [
  'felicia.ngajiusibe@gmail.com',
  'tmlabs.takeoutmedia@gmail.com',
  'chukajagu@gmail.com',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return APPROVED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
