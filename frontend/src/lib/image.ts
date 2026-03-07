/**
 * Resolve a stored image path (e.g. "/uploads/file.jpg") to a full URL
 * that works in development (different ports) and production.
 */
export function resolveImageUrl(path: string | undefined | null): string | undefined {
    if (!path) return undefined;
    // Already a full URL (http/https or data:)
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    // Relative path from backend — prepend backend base
    const base = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
    return `${base}${path}`;
}
