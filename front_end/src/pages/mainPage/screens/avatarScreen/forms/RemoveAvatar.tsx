import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	useDeleteAvatarMutation,
	useGetAvatarLinkQuery,
} from "@/service/slices/image/imageApiSLice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { Skeleton } from "@/components/ui/skeleton";
export default function RemoveAvatar() {
	const navigate = useNavigate();
	const { user_id } = useAppSelector(getCurrentUser);
	const [remove, { isLoading, isError, isSuccess, error }] =
		useDeleteAvatarMutation();
	const { data, isFetching } = useGetAvatarLinkQuery(user_id);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user_id) return;
		try {
			await remove(user_id);
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
			className="w-[98%] max-w-[30rem] h-fit border rounded-sm p-4 flex flex-col gap-5">
			<h1 className="text-lg font-semibold">Upload avatar</h1>
			{isError ? (
				<p className="text-sm text-destructive ">Error: {error.data.message}</p>
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
			<div className="flex items-center justify-end gap-5">
				<Button
					type="button"
					size="lg"
					variant="secondary"
					disabled={isLoading}
					onClick={() => navigate(-1)}>
					Cancel
				</Button>
				<Button size="lg">
					{isLoading ? <BtnsLoaderSpinner /> : "Remove"}
				</Button>
			</div>
		</form>
	);
}
