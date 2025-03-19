import { useEffect } from "react";
import checkAuth from "@/utils/checkAuth";
import { useNavigator } from "@/utils/navigator";

const PrivateRoutes = ({ children }) => {
  const { navigateTo } = useNavigator();
  const isAuthenticated = checkAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/auth/login");
    }
  }, [isAuthenticated, navigateTo]);

  return isAuthenticated ? children : null;
};

export default PrivateRoutes;
