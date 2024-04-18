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
    id?: number;
    channel_id: string;
    message_id: string;
    sender_id: string;
    message: string;
    channel: TChannelData;
    type: string;
    createdAt: Date;
    updatedAt?: Date;
  };

  type TChannelMemberData = {
    id?: number;
    user_id: string;
    channel_id: string;
    is_seen: boolean;
  };
  type TChannelData = {
    id?: number;
    channel_id: string;
    group_name?: string;
    is_private: boolean;
    messages: TMessageData[];
    members: TChannelMemberData[];
    createdAt: string;
    updatedAt?: string;
  };

  type TCreateNewPrivateChannel = {
    sender_id: string;
    message: string;
    type: string;
    members: { user_id: string }[];
  };

  type TSendMessage = {
    channel_id: string;
    sender_id: string;
    message: string;
    type: string;
  };
}

export {};
