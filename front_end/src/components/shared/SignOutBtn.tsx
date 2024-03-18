import BtnsLoaderSpinner from "../loader/BtnLoader";
import { Button } from "../ui/button";
import { useSignOutMutation } from "@/service/slices/auth/authApiSlice";
export default function SignOutBtn() {
	const [signout, { isLoading }] = useSignOutMutation();

	const handleSignout = async () => {
		await signout(null);
	};
	return (
		<Button size="sm" onClick={handleSignout} className="w-full">
			{isLoading ? <BtnsLoaderSpinner /> : "SignOut"}
		</Button>
	);
}
