import React from "react";
import { HelmetProvider } from "@/utils/HelmetProvider";

const DashboardPage = () => {
  return (
    <div>
      <HelmetProvider title="Dashboard" content="Dashboard page for IT.GUY" />
      DashboardPage
    </div>
  );
};

export default DashboardPage;
