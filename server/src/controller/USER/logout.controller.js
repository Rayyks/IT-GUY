import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { blacklistToken } from "../../utils/tokenBlacklist.js";

/**
 * @desc Logout User (Blacklist Token)
 * @route POST /api/user/logout
 * @access Private
 */
export const logoutUser = async (req, res) => {
  try {
    // Blacklist the token to prevent reuse
    blacklistToken(req.token);
    return successResponse(res, null, "User logged out successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
