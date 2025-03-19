import { OTP } from "@/components/auth/verificationForm";

const VerifyOtpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify Your Account
          </h1>
          <p className="text-gray-600">
            Please enter the verification code to continue
          </p>
        </div>
        <OTP />
      </div>
    </div>
  );
};

export default VerifyOtpPage;
