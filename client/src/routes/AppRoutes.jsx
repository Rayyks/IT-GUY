import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";

import PageLoader from "@/components/PageLoader";
import { HelmetProvider } from "react-helmet-async";
// PAGES & LAYOUTS
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <HelmetProvider>
        <Routes path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </HelmetProvider>
    </Suspense>
  );
};

export default AppRoutes;
