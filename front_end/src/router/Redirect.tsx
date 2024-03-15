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
		const refresher = async () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const res: any = await refresh(null);
				console.log(res);
				if (res?.data) {
					navigate("/chat");
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (!token) refresher();
	}, [token, refresh, navigate]);

	return <Outlet />;
}
