/**
 * Email validation utility
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate email with additional checks
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  const [localPart, domain] = email.split("@");

  // Check minimum length
  if (email.length < 3 || email.length > 254) {
    return { valid: false, error: "Email length is invalid" };
  }

  // Check local part (before @)
  if (localPart.length > 64) {
    return { valid: false, error: "Email local part is too long" };
  }

  // Check for consecutive dots
  if (email.includes("..")) {
    return { valid: false, error: "Email cannot contain consecutive dots" };
  }

  return { valid: true };
}
