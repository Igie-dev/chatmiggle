import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteUserByIdMutation } from "@/service/slices/user/userApiSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { useNavigate } from "react-router-dom";

type Props = {
  userId: string;
};
export default function DeleteAccount({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [deletAccount, { isLoading }] = useDeleteUserByIdMutation();
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!userId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await deletAccount(userId);
      if (res?.data) {
        navigate("/login");
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={handleClick}>
            {isLoading ? <BtnsLoaderSpinner /> : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
