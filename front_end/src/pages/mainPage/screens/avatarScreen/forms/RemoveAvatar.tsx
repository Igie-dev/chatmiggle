import { Button } from "@/components/ui/button";
import { FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteAvatarMutation,
  useGetAvatarLinkQuery,
} from "@/service/slices/image/imageApiSLice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
export default function RemoveAvatar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [remove, { isLoading, isError, isSuccess, error }] =
    useDeleteAvatarMutation();
  const { data, isFetching } = useGetAvatarLinkQuery(id as string);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    try {
      await remove(id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess, navigate]);
  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="w-[98%] max-w-[30rem] h-fit border rounded-sm p-4 flex flex-col gap-5"
    >
      <div className="relative flex items-center justify-center">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isLoading}
          onClick={() => navigate(-1)}
          className="absolute left-0"
        >
          <X size={20} />
        </Button>
        <h1 className="text-lg font-semibold">Remove avatar</h1>
      </div>

      {isError ? (
        <p className="text-sm text-destructive ">
          Error: {error?.data?.error ?? "Something went wrong"}
        </p>
      ) : null}
      <div className="border border-border overflow-hidden w-full h-[25rem] rounded-md flex items-center justify-center">
        {isFetching ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            {data?.url ? (
              <img src={data?.url} className="object-cover w-full h-full " />
            ) : (
              <p className="text-lg font-semibold">No avatar</p>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-end mt-5">
        <Button size="lg">
          {isLoading ? <BtnsLoaderSpinner /> : "Remove"}
        </Button>
      </div>
    </form>
  );
}
