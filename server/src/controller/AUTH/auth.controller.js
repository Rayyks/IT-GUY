import { registerUser } from "./register.controller.js";
import { loginUser } from "./login.controller.js";
import { verifyOTP } from "./verifyOTP.controller.js";
import { resendOTP } from "./resendOTP.controller.js";
import { requestAccountDeletion } from "./deleteAccount.controller.js";
import { cancelAccountDeletion } from "./cancelDeleteAccount.controller.js";
import {
  requestPasswordReset,
  resetPassword,
} from "./passwordReset.controller.js";

export {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  requestAccountDeletion,
  cancelAccountDeletion,
  requestPasswordReset,
  resetPassword,
};
