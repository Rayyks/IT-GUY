import { useLayoutEffect } from "react";
import checkAuth from "@/utils/checkAuth";
import { useNavigator } from "@/utils/navigator";

const PublicRoutes = ({ children }) => {
  const { navigateTo } = useNavigator();
  const isAuthenticated = checkAuth();

  useLayoutEffect(() => {
    if (isAuthenticated) {
      navigateTo("/dashboard");
    }
  }, [isAuthenticated, navigateTo]);

  return !isAuthenticated ? children : null;
};

export default PublicRoutes;
