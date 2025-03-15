import React from "react";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  return (
    <div>
      <Helmet>
        <title>Profil - IT.GUY</title>
        <meta
          name="description"
          content="Update profil kamu sambil ngetracking booking status kamu!"
        />
      </Helmet>
      ProfilePage
    </div>
  );
};

export default ProfilePage;
