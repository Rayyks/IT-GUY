import React from "react";
import { HelmetProvider } from "@/utils/HelmetProvider";

const ProfilePage = () => {
  return (
    <div>
      <HelmetProvider
        title="Profile"
        content="Profile page, you can update your information here, and tracking your booking history"
      />
      ProfilePage
    </div>
  );
};

export default ProfilePage;
