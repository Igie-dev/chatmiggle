import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import Progress from "./Progress";
export default function RegisterForm() {
  const navigate = useNavigate();
  const handleCancel = () => {
    sessionStorage.removeItem("firstName");
    sessionStorage.removeItem("lastName");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    navigate("/login");
  };
  return (
    <div className="w-full max-w-[30rem] flex flex-col items-center gap-5  px-2 py-2 rounded-md  relative border">
      <header className="relative flex flex-col items-center w-full gap-3 pt-5">
        <Button
          size="sm"
          type="button"
          onClick={handleCancel}
          variant="ghost"
          className="absolute top-0 left-2"
        >
          Log In
        </Button>
        <h5 className="text-lg font-semibold">Create your account</h5>
        <h1 className="text-lg font-black">Sign up</h1>
      </header>
      <Progress />
      <Outlet />
      <div className="flex items-center justify-center w-full gap-2 px-5 pt-5 pb-5 text-sm">
        <p>Already have an account?</p>
        <button onClick={handleCancel} className="text-blue-500">
          Login
        </button>
      </div>
    </div>
  );
}
