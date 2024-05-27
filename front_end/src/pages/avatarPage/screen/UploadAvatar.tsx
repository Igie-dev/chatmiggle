import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUploadAvatarMutation } from "@/service/slices/image/imageApiSLice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { X } from "lucide-react";
export default function UploadAvatar() {
  const [upload, { isLoading, isError, isSuccess, error }] =
    useUploadAvatarMutation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imageData, setImageData] = useState<File | null>(null);
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files as FileList;
    setImageData(files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !imageData) return;

    const formData = new FormData();
    formData.append("uploadavatar", imageData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await upload({ data: formData, id: id });
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
          disabled={isLoading}
          onClick={() => navigate(-1)}
          className="absolute left-0"
        >
          <X size={20} />
        </Button>
        <h1 className="text-lg font-semibold">Upload avatar</h1>
      </div>
      {isError ? (
        <p className="text-sm text-destructive ">
          Error: {error?.data?.error ?? "Something went wrong"}
        </p>
      ) : null}
      {preview ? (
        <div className="border border-border overflow-hidden w-full h-[25rem] rounded-md">
          <img
            src={preview as string}
            className="object-cover w-full h-full "
          />
        </div>
      ) : null}
      <Input
        onChange={handleInput}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="text-white"
      />
      <div className="flex items-center justify-end mt-5">
        <Button size="lg">
          {isLoading ? <BtnsLoaderSpinner /> : "Upload"}
        </Button>
      </div>
    </form>
  );
}
