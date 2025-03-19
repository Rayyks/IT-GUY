import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/services/axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + "/auth",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    verify: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/resend-otp",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/request-password-reset",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
