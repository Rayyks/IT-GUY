import {
  useRegisterMutation,
  useLoginMutation,
  useVerifyMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} from "@/redux/RTK/authApiSlice";
import { useDispatch } from "react-redux";
import {
  setUser_for_otp,
  clearUser_after_otp,
  successLogin,
  successLogout,
} from "@/redux/slices/authSlice";
import { useNavigator } from "@/utils/navigator";
import toast from "react-hot-toast";

export const useAuthForm = () => {
  const dispatch = useDispatch();
  const { navigateTo } = useNavigator();

  // API Mutations
  const [registerUser, { error: errorRegister }] = useRegisterMutation();
  const [loginUser, { error: errorLogin }] = useLoginMutation();
  const [verifyUser, { error: errorVerify }] = useVerifyMutation();
  const [resendOTP] = useResendOTPMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword, { error: errorResetPw }] = useResetPasswordMutation();
  const [logoutUser] = useLogoutMutation();

  // Helper to get email from sessionStorage
  const getEmailFromSession = () => sessionStorage.getItem("userEmail");

  // Helper to handle toast notifications
  const handleToastPromise = async (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  };

  // Handlers
  const handleRegister = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      dispatch(
        setUser_for_otp({
          email: response.data.email,
          userId: response.data.userId,
        })
      );
      navigateTo(`/auth/${response.data.userId}/verify-otp`, { replace: true });
    } catch (error) {
      console.error("❌ Error while registering user:", error);
    }
  };

  const handleVerifyUser = async (otp) => {
    try {
      const email = getEmailFromSession();
      if (!email) {
        console.error("❌ Email not found in session storage.");
        return;
      }

      await handleToastPromise(verifyUser({ email, otp }).unwrap(), {
        loading: "Verifying... 🔃",
        success: "Verification successful ✅",
        error: "Verification failed ❌",
      });

      dispatch(clearUser_after_otp());
      navigateTo("/auth/login", { replace: true });
    } catch (error) {
      console.error("❌ Error while verifying user:", error);
    }
  };

  const handleLogin = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      dispatch(successLogin(response.data.token));
      navigateTo("/dashboard", { replace: true });
    } catch (error) {
      console.error("❌ Error while logging in user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(successLogout(null));
      navigateTo("/auth/login", { replace: true });
    } catch (error) {
      console.error("❌ Error while logging out user:", error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const email = getEmailFromSession();
      if (!email) {
        console.error("❌ Email not found in session storage.");
        return;
      }

      await handleToastPromise(resendOTP({ email }).unwrap(), {
        loading: "Resending OTP... 🔃",
        success: "OTP resent successfully ✅",
        error: "Failed to resend OTP ❌",
      });
    } catch (error) {
      console.error("❌ Error while resending OTP:", error);
    }
  };

  return {
    // Handlers
    handleRegister,
    handleVerifyUser,
    handleResendOTP,
    handleLogin,
    handleLogout,
    // API Errors
    errorRegister,
    errorLogin,
    errorVerify,
    errorResetPw,
  };
};
