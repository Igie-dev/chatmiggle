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
type Props = {
  user: TUser;
};
export default function UpdateAccout({ user }: Props) {
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: new Yup.ObjectSchema({
      firstName: Yup.string().required("Please provide your First Name"),
      lastName: Yup.string().required("Please provide your Last Name"),
      email: Yup.string().required("Email is required").email(),
    }),
    onSubmit: async (values) => {
      console.log(values);

      if (
        user?.first_name === values.firstName &&
        user?.last_name === values.lastName &&
        user?.email === values.email
      )
        return;
    },
  });

  useLayoutEffect(() => {
    if (user) {
      if (
        formik.values.firstName ||
        formik.values.lastName ||
        formik.values.email
      )
        return;
      formik.setValues({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    }
  }, [user, formik]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Update profile
        </Button>
      </DialogTrigger>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className="sm:max-w-[30rem]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                defaultValue={formik.values.firstName}
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                defaultValue={formik.values.lastName}
                placeholder="Last Name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input defaultValue={formik.values.email} placeholder="Email" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
