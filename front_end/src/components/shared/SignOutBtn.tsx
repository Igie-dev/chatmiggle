import { useNavigate } from "react-router-dom";
import BtnsLoaderSpinner from "../loader/BtnLoader";
import { Button } from "../ui/button";
import { useSignOutMutation } from "@/service/slices/auth/authApiSlice";
export default function SignOutBtn() {
  const [signout, { isLoading }] = useSignOutMutation();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await signout(null);
      if (res?.data) {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleSignout}
      className="flex justify-start w-full px-2 text-xs"
    >
      {isLoading ? <BtnsLoaderSpinner /> : "SignOut"}
    </Button>
  );
}
