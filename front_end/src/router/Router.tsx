import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Persist from "@/pages/authPage/login/Persist";
import RouteGuard from "./RouteGuard";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import Redirect from "./Redirect";
import ChatBoxGuard from "./ChatBoxGuard";
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

  const AvatarScreen = lazy(
    () => import("@/pages/mainPage/screens/avatarScreen/AvatarScreen")
  );

  const UploadAvatar = lazy(
    () => import("@/pages/mainPage/screens/avatarScreen/forms/UploadAvatar")
  );

  const RemovedAvatar = lazy(
    () => import("@/pages/mainPage/screens/avatarScreen/forms/RemoveAvatar")
  );

  const ChatBoxContainer = lazy(
    () => import("@/pages/mainPage/screens/chatBox/ChatBoxContainer")
  );

  const ChannelScreen = lazy(
    () => import("@/pages/mainPage/screens/channelScreen/ChannelScreen")
  );

  const FriendsScreen = lazy(
    () => import("@/pages/mainPage/screens/friendsScreen/FriendsScreen")
  );

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<p>Error</p>} />
          {/* <Route element={<Redirect />}> */}
          <Route element={<Redirect />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="/register" element={<RegisterPage />}>
            <Route path="/register/form" element={<RegisterForm />} />
            <Route path="/register/otp" element={<RegisterVerifyOtp />} />
          </Route>
          {/* </Route> */}
          <Route element={<Persist />}>
            <Route element={<RouteGuard />}>
              {/* Channel */}
              <Route path="/c" element={<ChannelScreen />}>
                <Route element={<ChatBoxGuard />}>
                  <Route path="/c/:channelId" element={<ChatBoxContainer />} />
                </Route>
              </Route>
              {/* Group List */}
              <Route path="/f" element={<FriendsScreen />}>
                <Route element={<ChatBoxGuard />}>
                  <Route path="/f/:channelId" element={<ChatBoxContainer />} />
                </Route>
              </Route>
              <Route path="/avatar" element={<AvatarScreen />}>
                <Route path="/avatar/upload/:id" element={<UploadAvatar />} />
                <Route path="/avatar/remove/:id" element={<RemovedAvatar />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
