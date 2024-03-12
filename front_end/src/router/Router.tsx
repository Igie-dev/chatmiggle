import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function Router() {
	const LandingPage = lazy(() => import("@/pages/landingPage/LandingPage"));
	const RegisterPage = lazy(
		() => import("@/pages/authPage/register/RegisterPage")
	);
	const LoginPage = lazy(() => import("@/pages/authPage/login/LoginPage"));
	return (
		<Suspense fallback={<p>loading...</p>}>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<p>Error</p>} />
					{/* <Route element={<Redirect />}> */}
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/login" element={<RegisterPage />} />
					{/* </Route> */}
					{/* <Route path="/register" element={<RegisterPage />} />
					<Route element={<Persist />}>
						<Route element={<ProtectedRoutes />}>
							<Route path="/message" element={<MainPage />}>
								<Route path="/message/channel" element={<ChatScreen />} />
							</Route>
						</Route>
					</Route> */}
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
}
