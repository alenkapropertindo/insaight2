/**
 * Hashes a plaintext password using the Web Crypto API (SHA-256) with a salt
 * to prevent rainbow table attacks.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) return "";
  
  const encoder = new TextEncoder();
  const saltedPassword = `insaight_salt_secure_${password}`;
  const data = encoder.encode(saltedPassword);
  
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}
