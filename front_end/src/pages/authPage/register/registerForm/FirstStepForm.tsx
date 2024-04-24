import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function FirstStepForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: localStorage.getItem("firstName") as string,
      lastName: localStorage.getItem("lastName") as string,
    },
    validationSchema: new Yup.ObjectSchema({
      firstName: Yup.string().required("Please provide your First Name"),
      lastName: Yup.string().required("Please provide your Last Name"),
    }),
    onSubmit: async (values) => {
      localStorage.setItem("firstName", values.firstName);
      localStorage.setItem("lastName", values.lastName);
      navigate("/register/form/step2");
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-center w-full gap-7"
    >
      <div className="w-[90%] flex flex-col gap-1 relative">
        <Label htmlFor="firstName" className="text-sm font-semibold">
          First Name
        </Label>
        <input
          ref={inputRef}
          type="text"
          id="firstName"
          autoComplete="false"
          placeholder="Enter your First Name"
          value={formik.values.firstName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent border-b ${
            formik.touched.firstName && formik.errors.firstName
              ? "border-destructive"
              : "border-border"
          } `}
        />
        <p className="absolute left-0 text-xs -bottom-5 text-destructive">
          {formik.touched.firstName && formik.errors.firstName
            ? formik.errors.firstName
            : null}
        </p>
      </div>
      <div className="w-[90%] flex flex-col gap-1 relative">
        <Label htmlFor="lastName" className="text-sm font-semibold">
          Last Name
        </Label>
        <input
          type="text"
          id="lastName"
          autoComplete="false"
          placeholder="Enter your Last Name"
          value={formik.values.lastName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full h-11 outline-none pl-2 pr-10   text-sm  bg-transparent border-b  ${
            formik.touched.lastName && formik.errors.lastName
              ? "border-destructive"
              : "border-border"
          } `}
        />
        <p className="absolute left-0 text-xs -bottom-5 text-destructive">
          {formik.touched.lastName && formik.errors.lastName
            ? formik.errors.lastName
            : null}
        </p>
      </div>
      <div className="flex w-full gap-2 px-5 mt-10">
        <Button size="lg" type="submit" variant="default" className="w-full">
          Next
        </Button>
      </div>
    </form>
  );
}
