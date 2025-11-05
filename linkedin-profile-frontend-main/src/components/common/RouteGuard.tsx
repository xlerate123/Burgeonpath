import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      const userToken = localStorage.getItem('userToken');
      const adminEmail = localStorage.getItem('adminEmail');
      const adminName = localStorage.getItem('adminName');

      if ((userData && userToken) || (adminEmail && adminName)) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>;
};