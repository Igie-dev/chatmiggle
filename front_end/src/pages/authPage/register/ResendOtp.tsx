import { useRequestVerifyEmailMutation } from "@/service/slices/auth/authApiSlice";
import { useEffect, useState } from "react";
type Props = {
	email: string;
};
export default function ResendOtp({ email }: Props) {
	const [timer, setTimer] = useState(60);
	const [disable, setDisable] = useState(true);
	const [requetVerify, { isLoading, isError, error }] =
		useRequestVerifyEmailMutation();
	//Timer
	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((lastTimerCount) => {
				lastTimerCount <= 1 && clearInterval(interval);
				if (lastTimerCount <= 1) setDisable(false);
				if (lastTimerCount <= 0) return lastTimerCount;
				return lastTimerCount - 1;
			});
		}, 1000); //each count lasts for a second
		//cleanup the interval on complete
		return () => clearInterval(interval);
	}, [disable]);

	const handleRequestOtp = async () => {
		if (!email || disable) return;

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const res: any = await requetVerify(email);

			if (res?.data?.email) {
				setDisable(true);
				setTimer(60);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="flex items-center gap-2 text-xs">
			{isError ? (
				<>
					<p className="text-destructive">{error?.data?.message}</p>
					<button
						onClick={() => window.location.reload()}
						type="button"
						className="px-3 py-2 rounded-md bg-secondary">
						Register again
					</button>
				</>
			) : (
				<>
					<p>Didn't recieve code? </p>
					{disable ? (
						<p> {`Resend OTP in ${timer}s`}</p>
					) : (
						<button
							onClick={handleRequestOtp}
							type="button"
							disabled={isLoading}
							className="px-3 py-2 rounded-md bg-secondary disabled:cursor-wait">
							{isLoading ? "Please wait..." : "Request Otp"}
						</button>
					)}
				</>
			)}
		</div>
	);
}
