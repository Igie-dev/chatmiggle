import { useAppSelector } from "@/service/store";
import { getCurrentToken } from "@/service/slices/auth/authSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { Outlet, Navigate, useLocation } from "react-router-dom";
export default function RouteGuard() {
  const location = useLocation();
  const token = useAppSelector(getCurrentToken);
  const user = useAppSelector(getCurrentUser);

  if (!token || !user.userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
