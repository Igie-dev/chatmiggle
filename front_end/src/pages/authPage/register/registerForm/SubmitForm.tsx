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
    const firstName = localStorage.getItem("firstName") as string;
    const lastName = localStorage.getItem("lastName") as string;
    const email = localStorage.getItem("email") as string;
    const password = localStorage.getItem("password") as string;
    try {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await requetVerify(email);
      if (res?.data?.email) {
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        navigate(
          `/register/otp?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${encodeURIComponent(
            password
          )}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevious = () => {
    navigate("/register/form/step2");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <p
        className={`text-sm font-semibold ${
          isError ? "text-destructive" : ""
        } `}
      >
        {error?.data?.error}
      </p>

      <div className="flex flex-col items-center w-full gap-2">
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">First Name</span>
          <p className="w-full px-2 py-3 border-b">
            {localStorage.getItem("firstName")}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">Last Name</span>
          <p className="w-full px-2 py-3 border-b">
            {localStorage.getItem("lastName")}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1">
          <span className="text-sm font-semibold">Email</span>
          <p className="w-full px-2 py-3 border-b">
            {localStorage.getItem("email")}
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
