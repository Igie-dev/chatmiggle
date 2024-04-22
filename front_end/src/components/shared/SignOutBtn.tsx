import BtnsLoaderSpinner from "../loader/BtnLoader";
import { Button } from "../ui/button";
import { useSignOutMutation } from "@/service/slices/auth/authApiSlice";
export default function SignOutBtn() {
  const [signout, { isLoading }] = useSignOutMutation();

  const handleSignout = async () => {
    await signout(null);
  };
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleSignout}
      className="flex justify-start w-full text-xs"
    >
      {isLoading ? <BtnsLoaderSpinner /> : "SignOut"}
    </Button>
  );
}
