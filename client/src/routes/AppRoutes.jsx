import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";

import PageLoader from "@/components/PageLoader";
import { HelmetProvider } from "react-helmet-async";
// PAGES & LAYOUTS
const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/app/ProfilePage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <HelmetProvider>
        <Routes>
          {/* LANDING */}
          <Route path="/" element={<LandingPage />} />
          {/* APP ROUTES */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </Suspense>
  );
};

export default AppRoutes;
