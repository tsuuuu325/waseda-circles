const WASeda_EMAIL_PATTERN = /@(f\.)?waseda\.jp$|@my\.waseda\.jp$/i;

export function isWasedaEmail(email) {
  return WASeda_EMAIL_PATTERN.test(email.trim());
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
