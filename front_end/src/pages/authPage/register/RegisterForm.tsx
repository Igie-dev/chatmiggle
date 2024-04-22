import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef } from "react";
import BtnLoader from "@/components/loader/BtnLoader";
import { Link, useNavigate } from "react-router-dom";
import { useRequestVerifyEmailMutation } from "@/service/slices/auth/authApiSlice";
import { encryptText } from "@/lib/helper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [requetVerify, { isLoading, isError, error }] =
    useRequestVerifyEmailMutation();

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCancel = () => {
    console.log("Clicked");
    navigate(-1);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmpass: "",
    },
    validationSchema: new Yup.ObjectSchema({
      firstName: Yup.string().required("Please provide your First Name"),
      lastName: Yup.string().required("Please provide your Last Name"),
      email: Yup.string().required("Email is required").email(),
      password: Yup.string().required("Create your password"),
      confirmpass: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password")], "Password doesn't match!"),
    }),
    onSubmit: async (values) => {
      if (values.password !== values.confirmpass) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await requetVerify(values.email);
        if (res?.data?.email) {
          navigate(
            `/register/otp?firstName=${values.firstName}&lastName=${
              values.lastName
            }&email=${values.email}&password=${encryptText(
              encodeURIComponent(values.password)
            )}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    onReset: (_, { resetForm }) => {
      resetForm();
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[35rem] flex flex-col items-center gap-5  px-2 py-5 rounded-md md:px-5 md:py-10 relative border"
    >
      <header className="w-full max-w-[30rem] flex flex-col gap-3 items-center">
        <h5 className="text-lg font-semibold">Create your account</h5>
        <h1 className="text-lg font-black">Sign up</h1>
        <p
          className={`text-sm font-semibold ${
            isError ? "text-destructive" : ""
          } `}
        >
          {error?.data?.message}
        </p>
      </header>

      <div className="flex flex-col items-center w-full gap-7">
        <div className="w-[90%] flex flex-col gap-1 relative">
          <Label htmlFor="firstName" className="text-sm font-semibold">
            First Name
          </Label>
          <Input
            ref={inputRef}
            type="text"
            id="firstName"
            autoComplete="false"
            placeholder="Enter your First Name"
            value={formik.values.firstName || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent  border rounded-lg  ${
              formik.touched.firstName && formik.errors.firstName
                ? "border-destructive"
                : "border-border"
            } `}
          />
          <p className="absolute text-xs left-2 -bottom-5 text-destructive">
            {formik.touched.firstName && formik.errors.firstName
              ? formik.errors.firstName
              : null}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1 relative">
          <Label htmlFor="lastName" className="text-sm font-semibold">
            Last Name
          </Label>
          <Input
            type="text"
            id="lastName"
            autoComplete="false"
            placeholder="Enter your Last Name"
            value={formik.values.lastName || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent  border rounded-lg  ${
              formik.touched.lastName && formik.errors.lastName
                ? "border-destructive"
                : "border-border"
            } `}
          />
          <p className="absolute text-xs left-2 -bottom-5 text-destructive">
            {formik.touched.lastName && formik.errors.lastName
              ? formik.errors.lastName
              : null}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1 relative">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input
            type="text"
            id="email"
            autoComplete="false"
            placeholder="Enter your Email"
            value={formik.values.email || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent  border rounded-lg    ${
              formik.touched.email && formik.errors.email
                ? "border-destructive"
                : "border-border"
            }  `}
          />
          <p className="absolute text-xs left-2 -bottom-5 text-destructive">
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : null}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1 relative">
          <Label htmlFor="password" className="text-sm font-semibold">
            Create password
          </Label>
          <Input
            type="password"
            id="password"
            autoComplete="false"
            placeholder="Create your password"
            value={formik.values.password || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent  border rounded-lg  ${
              formik.touched.password && formik.errors.password
                ? "border-destructive"
                : "border-border"
            } `}
          />
          <p className="absolute text-xs left-2 -bottom-5 text-destructive">
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : null}
          </p>
        </div>
        <div className="w-[90%] flex flex-col gap-1 relative">
          <Label htmlFor="confirmpass" className="text-sm font-semibold">
            Confirm password
          </Label>
          <Input
            type="password"
            id="confirmpass"
            placeholder="Confirm your password"
            autoComplete="false"
            value={formik.values.confirmpass || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full h-11 outline-none pl-2 pr-10   text-sm bg-transparent border rounded-lg  ${
              formik.touched.confirmpass && formik.errors.confirmpass
                ? "border-destructive"
                : "border-border"
            } `}
          />
          <p className="absolute text-xs left-2 -bottom-5 text-destructive">
            {formik.touched.confirmpass && formik.errors.confirmpass
              ? formik.errors.confirmpass
              : null}
          </p>
        </div>
        <div className="flex w-full gap-5 px-5 mt-10">
          <Button
            type="reset"
            title="Register"
            size="lg"
            variant="secondary"
            disabled={isLoading}
            onClick={handleCancel}
            className="w-[50%] h-10 text-xs rounded-md"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            title="Register"
            size="lg"
            disabled={isLoading}
            className="w-[50%] h-10 text-xs rounded-md"
          >
            {isLoading ? <BtnLoader /> : "Submit"}
          </Button>
        </div>
        <div className="flex items-center justify-center w-full gap-2 px-5 pt-5 text-sm">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
