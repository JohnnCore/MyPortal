export const CookieUtils = {
  /**
   * Set a cookie with security options
   */
  set: (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieOptions = [
      `${name}=${encodeURIComponent(value)}`,
      `expires=${expires.toUTCString()}`,
      `path=/`,
      `SameSite=Strict`, // CSRF protection
      // Uncomment in production with HTTPS:
      // `Secure`, // Only send over HTTPS
      // "HttpOnly", // Not accessible via JavaScript
      // `Domain=domain.com`, // Set your domain
    ];

    document.cookie = cookieOptions.join('; ');
  },

  /**
   * Get a cookie value by name
   */
  get: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  },

  /**
   * Remove a cookie
   */
  remove: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  /**
   * Check if a cookie exists
   */
  has: (name: string): boolean => {
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${name}=`));
  },
};
