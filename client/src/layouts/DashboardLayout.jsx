import React from "react";
import { Outlet } from "react-router";
const DashboardLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default DashboardLayout;
