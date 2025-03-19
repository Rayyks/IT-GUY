import { useNavigate } from "react-router";

export const useNavigator = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return { navigate, navigateTo, navigateBack };
};
