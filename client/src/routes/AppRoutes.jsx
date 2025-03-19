import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";

// UTILS & COMPONENTS
import PageLoader from "@/components/PageLoader";
import { Toaster } from "react-hot-toast";
import { AppLayout } from "@/utils/SEO";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

// PAGES & LAYOUTS
const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/app/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const VerifyOtpPage = lazy(() => import("@/pages/auth/VerifyOtpPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* LANDING */}
        <Route
          path="/"
          element={
            <AppLayout
              title="Landing Page"
              description="Cari tahu lebih banyak tentang kami"
            >
              <LandingPage />
            </AppLayout>
          }
        />
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <PublicRoutes>
                <AppLayout title="login" description="Masuk ke akun anda">
                  <LoginPage />
                </AppLayout>
              </PublicRoutes>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoutes>
                <AppLayout title="register" description="Daftar akun baru">
                  <RegisterPage />
                </AppLayout>
              </PublicRoutes>
            }
          />
          <Route
            path=":userId/verify-otp"
            element={
              <PublicRoutes>
                <AppLayout
                  title="verify-otp"
                  description="Verifikasi akun anda"
                >
                  <VerifyOtpPage />
                </AppLayout>
              </PublicRoutes>
            }
          />
        </Route>
        {/* APP ROUTES */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={
              <PrivateRoutes>
                <AppLayout title="Dashboard" description="Dashboard utama">
                  <DashboardPage />
                </AppLayout>
              </PrivateRoutes>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoutes>
                <AppLayout title="Profile" description="Profile anda">
                  <ProfilePage />
                </AppLayout>
              </PrivateRoutes>
            }
          />
        </Route>
      </Routes>
      <Toaster position="bottom" reverseOrder={false} />
    </Suspense>
  );
};

export default AppRoutes;
