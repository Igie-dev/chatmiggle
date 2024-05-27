import { Button } from "@/components/ui/button";
import { useRequestVerifyEmailMutation } from "@/service/slices/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { FormEvent } from "react";
export default function SubmitForm() {
  const [requetVerify, { isLoading, isError, error }] =
    useRequestVerifyEmailMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = sessionStorage.getItem("email") as string;
    try {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await requetVerify(email);
      if (res?.data?.email) {
        navigate("/register/otp");
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const handlePrevious = () => {
    navigate("/register/form/email");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <p
        className={`text-sm font-semibold mb-5 ${
          isError ? "text-destructive" : ""
        } `}
      >
        {error?.data?.error}
      </p>

      <div className="flex flex-col items-center w-full gap-2">
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">First Name</span>
          <p className="w-full px-2 py-3 border rounded-md">
            {sessionStorage.getItem("firstName")}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">Last Name</span>
          <p className="w-full px-2 py-3 border rounded-md">
            {sessionStorage.getItem("lastName")}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">Email</span>
          <p className="w-full px-2 py-3 border rounded-md">
            {sessionStorage.getItem("email")}
          </p>
        </div>
      </div>

      <div className="flex w-full gap-2 px-5 mt-10">
        <Button
          size="lg"
          type="button"
          disabled={isLoading}
          onClick={handlePrevious}
          variant="secondary"
          className="w-full"
        >
          Previous
        </Button>
        <Button
          size="lg"
          type="submit"
          disabled={isLoading}
          variant="default"
          className="w-full"
        >
          {isLoading ? <BtnsLoaderSpinner /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}
