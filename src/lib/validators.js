export function isValidEmail(email) {
  const normalized = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
