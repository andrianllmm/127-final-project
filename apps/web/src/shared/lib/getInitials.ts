const DEFAULT_INITIAL = 'U';

export function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  if (email) return email[0]?.toUpperCase() ?? DEFAULT_INITIAL;

  return DEFAULT_INITIAL;
}
