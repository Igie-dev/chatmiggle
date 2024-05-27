import React, { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateUserMutation } from "@/service/slices/user/userApiSlice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
type Props = {
  user: TUser;
};
export default function UpdateAccout({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [update, { isLoading, error }] = useUpdateUserMutation();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: new Yup.ObjectSchema({
      firstName: Yup.string().required("Please provide your first name"),
      lastName: Yup.string().required("Please provide your last name"),
    }),
    onSubmit: async (values) => {
      if (
        user?.first_name === values.firstName &&
        user?.last_name === values.lastName
      )
        return;

      const data = {
        user_id: user.user_id,
        first_name: values.firstName,
        last_name: values.lastName,
      };

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await update(data);
        if (res?.data) {
          setOpen(false);
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },
  });

  useLayoutEffect(() => {
    if (open) {
      if (!formik.values.firstName && !formik.values.lastName) {
        formik.setValues({
          firstName: user.first_name,
          lastName: user.last_name,
        });
      }
    } else {
      if (formik.values.firstName && formik.values.lastName) {
        formik.resetForm();
      }
    }
  }, [user, open, formik]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Update profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[30rem]">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full gap-5"
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <p>{error?.data?.error}</p>
          <div className="flex flex-col gap-6">
            <div className="relative flex flex-col gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formik.values.firstName}
                placeholder="First Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                disabled={isLoading}
                className={`${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-destructive"
                    : "border-border"
                }`}
              />
              <p className="absolute left-0 text-xs -bottom-5 text-destructive">
                {formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : null}
              </p>
            </div>
            <div className="relative flex flex-col gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formik.values.lastName}
                placeholder="Last Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                disabled={isLoading}
                className={`${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-destructive"
                    : "border-border"
                }`}
              />
              <p className="absolute left-0 text-xs -bottom-5 text-destructive">
                {formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : null}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                (user?.first_name === formik.values.firstName &&
                  user?.last_name === formik.values.lastName) ||
                !formik.values.lastName ||
                !formik.values.firstName ||
                isLoading
              }
            >
              {isLoading ? <BtnsLoaderSpinner /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
