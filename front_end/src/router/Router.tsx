import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Persist from "@/pages/authPage/login/Persist";
import RouteGuard from "./RouteGuard";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import Redirect from "./Redirect";
export default function Router() {
	const LandingPage = lazy(() => import("@/pages/landingPage/LandingPage"));

	const LoginPage = lazy(() => import("@/pages/authPage/login/LoginPage"));

	const RegisterPage = lazy(
		() => import("@/pages/authPage/register/RegisterPage")
	);

	const RegisterForm = lazy(
		() => import("@/pages/authPage/register/RegisterForm")
	);

	const RegisterVerifyOtp = lazy(
		() => import("@/pages/authPage/register/RegisterVeryOtp")
	);

	const MainPage = lazy(() => import("@/pages/mainPage/MainPage"));
	return (
		<Suspense fallback={<LoaderSpinner />}>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<p>Error</p>} />
					{/* <Route element={<Redirect />}> */}
					<Route element={<Redirect />}>
						<Route path="/" element={<LandingPage />} />
					</Route>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />}>
						<Route path="/register/form" element={<RegisterForm />} />
						<Route path="/register/otp" element={<RegisterVerifyOtp />} />
					</Route>
					{/* </Route> */}
					<Route element={<Persist />}>
						<Route element={<RouteGuard />}>
							<Route path="/chat" element={<MainPage />}>
								{/* <Route path="/message/channel" element={<ChatScreen />} /> */}
							</Route>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
}
