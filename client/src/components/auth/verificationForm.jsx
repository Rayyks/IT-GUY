"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/authSchema";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { OTPInput } from "input-otp";
import { cn } from "@/lib/utils";

// Define all components in one file to ensure they work together
const InputOTP = ({ value, onChange, maxLength = 6 }) => {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      containerClassName="flex items-center justify-center gap-2"
      render={({ slots }) => (
        <div className="flex gap-2">
          {slots.map((slot, idx) => (
            <InputOTPSlot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  );
};

const InputOTPSlot = ({ char, hasFakeCaret, isActive, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-14 w-12 items-center justify-center rounded-md border-2 bg-white text-xl font-semibold text-black shadow transition-all",
        isActive && "border-blue-500 ring-2 ring-blue-500/30",
        !char && "text-gray-400",
        char && "border-green-500"
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-6 w-0.5 bg-blue-500 duration-700" />
        </div>
      )}
    </div>
  );
};

export function OTP() {
  const [isResending, setIsResending] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const { handleVerifyUser, handleResendOTP } = useAuthForm();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      email: sessionStorage.getItem("userEmail") || "",
    },
  });

  // Update form value when OTP changes
  useEffect(() => {
    if (otpValue) {
      setValue("otp", otpValue);
      if (otpValue.length === 6) {
        trigger("otp");
      }
    }
  }, [otpValue, setValue, trigger]);

  const onSubmit = async (data) => {
    try {
      await handleVerifyUser(data.otp);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      handleResendOTP();
      setIsResending(false);
    } catch (error) {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="text-center space-y-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Verification Code
        </h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to
          <span className="font-medium text-blue-600 block mt-1">
            {sessionStorage.getItem("userEmail") || "your email"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
            Enter verification code
          </Label>
          <div className="flex justify-center py-2">
            <InputOTP value={otpValue} onChange={setOtpValue} maxLength={6} />
          </div>
          {errors.otp && (
            <p className="text-sm text-red-500 text-center mt-1">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          disabled={otpValue.length !== 6 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        <Button
          type="button"
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend Code"
          )}
        </Button>
      </div>
    </div>
  );
}
