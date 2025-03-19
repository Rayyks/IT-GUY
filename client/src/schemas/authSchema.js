import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Nama lengkap di butuhkan" }),
  username: z.string().min(3, { message: "Username minimal 3 huruf" }),
  phone: z.string().regex(/^(62|08)\d{8,}$/, {
    message:
      "Nomor telepon harus dimulai dengan 62 atau 08 dan minimal 10 digit",
  }),
  email: z.string().email({ message: "Email tidak valid" }),
  location: z.string().optional(),
  password: z.string().min(8, { message: "Password minimal 8 huruf" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 huruf" }),
});

export const otpSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  otp: z.string().length(6, { message: "OTP harus 6 digit" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Email tidak valid" }),
    otp: z.string().length(6, { message: "OTP harus 6 digit" }),
    newPassword: z.string().min(8, { message: "Password minimal 8 huruf" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
