import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { encryptText } from "@/utils/helper";
import { Input } from "@/components/ui/input";
export default function SecondStepForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("email") as string,
      password: "",
      confirmpass: "",
    },
    validationSchema: new Yup.ObjectSchema({
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
      localStorage.setItem("email", values.email);
      localStorage.setItem("password", encryptText(values.password));
      navigate("/register/form/confirm");
    },
  });

  const handlePrevious = () => {
    navigate("/register/form");
  };
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-center w-full gap-7"
    >
      <div className="w-[90%] flex flex-col gap-1 relative">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email
        </Label>
        <Input
          type="text"
          ref={inputRef}
          id="email"
          autoComplete="false"
          placeholder="Enter your Email"
          value={formik.values.email || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full  ${
            formik.touched.email && formik.errors.email
              ? "border-destructive"
              : "border-border"
          }  `}
        />
        <p className="absolute left-0 text-xs -bottom-5 text-destructive">
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
          type={isShowPassword ? "text" : "password"}
          id="password"
          autoComplete="false"
          placeholder="Create your password"
          value={formik.values.password || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full ${
            formik.touched.password && formik.errors.password
              ? "border-destructive"
              : "border-border"
          } `}
        />
        <p className="absolute left-0 text-xs -bottom-5 text-destructive">
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
          type={isShowPassword ? "text" : "password"}
          id="confirmpass"
          placeholder="Confirm your password"
          autoComplete="false"
          value={formik.values.confirmpass || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full  ${
            formik.touched.confirmpass && formik.errors.confirmpass
              ? "border-destructive"
              : "border-border"
          } `}
        />
        <p className="absolute left-0 text-xs -bottom-5 text-destructive">
          {formik.touched.confirmpass && formik.errors.confirmpass
            ? formik.errors.confirmpass
            : null}
        </p>
      </div>
      <div className="w-[90%] flex mt-2 items-center gap-2">
        <Input
          type="checkbox"
          className="w-4 h-4"
          onChange={(e) => {
            if (e.target.checked) {
              setIsShowPassword(true);
            } else {
              setIsShowPassword(false);
            }
          }}
        />
        <p className="text-sm">Show password</p>
      </div>

      <div className="flex w-full gap-2 px-5 mt-5">
        <Button
          size="lg"
          type="button"
          onClick={handlePrevious}
          variant="secondary"
          className="w-full"
        >
          Previous
        </Button>
        <Button size="lg" type="submit" variant="default" className="w-full">
          Next
        </Button>
      </div>
    </form>
  );
}
