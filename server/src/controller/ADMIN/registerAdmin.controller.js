import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { generateUniqueId } from "../../utils/generateUniqueId.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, phone, username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return errorResponse(res, { message: "Email already in use" }, 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const setRole = "admin";

    // Create new user
    const newUser = new User({
      userId: generateUniqueId("ADMIN"),
      name,
      phone,
      username,
      email,
      password: hashedPassword,
      role: setRole,
      isVerified: true,
    });

    await newUser.save();

    return successResponse(res, null, "Admin registered successfully.", 201);
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
