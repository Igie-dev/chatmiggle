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
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
export default function RemoveAvatar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [remove, { isLoading, isError, isSuccess, error }] =
    useDeleteAvatarMutation();
  const {
    data: user,
    isLoading: getUserIsLoading,
    error: getUserError,
  } = useGetUserByIdQuery(id as string);
  const { data, isFetching } = useGetAvatarLinkQuery(user?.avatrId, {
    skip: !user?.avatarId,
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    try {
      await remove(id);
      // eslint-disable-next-line no-empty
    } catch (error) {}
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
          disabled={isLoading || getUserIsLoading}
          onClick={() => navigate(-1)}
          className="absolute left-0"
        >
          <X size={20} />
        </Button>
        <h1 className="text-lg font-semibold">Remove avatar</h1>
      </div>

      {isError ? (
        <p className="text-sm text-destructive ">
          Error:
          {error?.data?.error ??
            getUserError?.data?.error ??
            "Something went wrong"}
        </p>
      ) : null}
      <div className="border border-border overflow-hidden w-full h-[25rem] rounded-md flex items-center justify-center">
        {isFetching || isLoading || getUserIsLoading ? (
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
          {isLoading || getUserIsLoading ? <BtnsLoaderSpinner /> : "Remove"}
        </Button>
      </div>
    </form>
  );
}
