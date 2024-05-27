import { useRefreshMutation } from "@/service/slices/auth/authApiSlice";
import { getCurrentToken } from "@/service/slices/auth/authSlice";
import { useAppSelector } from "@/service/store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Redirect() {
  const token = useAppSelector(getCurrentToken);
  const [refresh] = useRefreshMutation();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    const refresher = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await refresh(null);
        if (res?.data) {
          navigate("/c");
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    };
    if (!token) refresher();
  }, [token, refresh, navigate]);

  return <Outlet />;
}
