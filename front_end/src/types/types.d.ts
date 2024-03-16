declare global {
	type TCurrentUer = {
		user_id: string;
		email: string;
		first_name: string;
		last_name: string;
	};
	type TLogin = {
		email: string;
		password: string;
	};

	type TRegister = {
		first_name: string;
		last_name: string;
		email: string;
		password: string;
		otp: string;
	};
	type TUser = {
		id?: string;
		user_id: string;
		first_name: string;
		last_name: string;
		email: string;
		createdAt: Date;
		updatedAt: Date;
	};

	type TUpdateUser = {
		user_id: string;
		first_name: string;
		last_name: string;
	};
}

export {};
