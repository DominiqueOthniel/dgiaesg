export function resolveImageUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
  return `${base}${path}`;
}
