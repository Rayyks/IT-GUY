const tokenBlacklist = new Set();

/**
 * @desc Add token to blacklist
 * @param {string} token - JWT token to blacklist
 */
export const blacklistToken = (token) => {
  if (token) {
    tokenBlacklist.add(token);
    // Optional: Auto-remove token after expiration time (e.g., 1 hour)
    setTimeout(() => {
      tokenBlacklist.delete(token);
    }, 3600000); // 1 hour
  }
};

/**
 * @desc Check if token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is blacklisted
 */
export const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};
