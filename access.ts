// lib/access.ts
export function verifyAccessKey(key: string): boolean {
  const master = process.env.LOWKEY_MASTER_ACCESS_KEY;
  if (!master) return false;
  return key.trim() === master.trim();
}
