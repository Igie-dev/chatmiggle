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
		id?: number;
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

	type TMessageData = {
		id?: number,
		channel_id:string,
		message_id:string
		sender_id:string,
		message:string,
		type:string,
		createdAt:Date,
		updatedAt?:Date,
	}
	
	type TChannelData = {
		id?:number,
		channel_id:string,
		group_name?: string,
		isPrivate:boolean,
		messages: TMessageData[],
		members: {id?:number, user_id:string,channel_id:string}[],
		createdAt:string,
		updatedAt?:string,
	}

	type TMessageSend = {
		sender_id:string,
		message:string,
		type:string,
		members:{user_id:string}[]
		
	}
}

export {};
