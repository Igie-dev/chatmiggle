/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAppSelector } from "@/service/store";
import { getCurrentToken } from "@/service/slices/auth/authSlice";
import LoadingSpinner from "@/components/loader/LoaderSpinner";
import { useRefreshMutation } from "@/service/slices/auth/authApiSlice";
const Persist = () => {
  const token = useAppSelector(getCurrentToken);
  const [refresh, { isLoading, isError, error }] = useRefreshMutation();
  useEffect(() => {
    const refresher = async () => {
      try {
        await refresh(null);
        // eslint-disable-next-line no-empty
      } catch (error: any) {}
    };
    if (!token) refresher();
  }, [token, refresh]);

  let content: any;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isError || !token) {
    content = (
      <div className="grid w-screen h-screen place-content-center">
        <div className="flex justify-center gap-1 text-xs font-medium lg:text-sm">
          <p>{`${
            isError && error?.data?.error
              ? error?.data?.error
              : "Something went wrong!"
          } - `}</p>
          <Link to="/login" className="text-blue-400 underline cursor-pointer">
            Please Login again
          </Link>
        </div>
      </div>
    );
  } else if (!isError) {
    content = <Outlet />;
  } else if (token) {
    content = <Outlet />;
  }
  return content;
};

export default Persist;
