import { useSelector } from "react-redux";

const checkAuth = (state) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? true : false;
};

export default checkAuth;
