import { messagesDto, channelsDto } from "../dto/channelDto.js";

export function userDto(user) {
  let dto = {
    id: user?.id,
    userId: user?.user_id,
    firstName: user?.first_name,
    lastName: user?.last_name,
    email: user?.email,
    avatarId: user?.avatar_id,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
    channels: [],
    messages: [],
  };

  if (user?.channels?.length >= 1) {
    dto.channels = channelsDto(user?.channels);
  }

  if (user?.messages?.length >= 1) {
    dto.messages = messagesDto(user?.messages);
  }
  return dto;
}

export function usersDto(users) {
  let dto = [];

  if (users.length >= 1) {
    for (let user of users) {
      dto.push(userDto(user));
    }
  }

  return dto;
}
