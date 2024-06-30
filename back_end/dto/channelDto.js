import { userDto } from "../dto/userDto.js";
export function channelDto(channel) {
  let dto = {
    id: channel?.id,
    channelId: channel?.channel_id,
    channelName: channel?.channel_name,
    avatarId: channel?.avatar_id,
    createdAt: channel?.createdAt,
    updatedAt: channel?.updatedAt,
    members: [],
    messages: [],
  };

  if (channel?.members?.length >= 1) {
    dto.members = channelMembersDto(channel?.members);
  }

  if (channel?.messages?.length >= 1) {
    dto.messages = messagesDto(channel?.messages);
  }

  return dto;
}

export function channelsDto(channels) {
  let dto = [];

  if (channels?.length >= 1) {
    for (let channel of channels) {
      dto.push(channelDto(channel));
    }
  }
  return dto;
}

export function channelMemberDto(member) {
  let dto = {
    id: member?.id,
    userId: member?.user_id,
    channelId: member?.channel_id,
    isAdmin: member?.is_admin,
    isSeen: member?.is_seen,
    joinApproved: member?.join_approved,
    user: null,
    channel: null,
  };
  if (member?.user?.id) {
    dto.user = userDto(member?.user);
  }

  if (member?.channel?.id) {
    dto.channel = channelDto(member.channel);
  }

  return dto;
}

export function channelMembersDto(members) {
  let dto = [];
  if (members.length >= 1) {
    for (let member of members) {
      dto.push(channelMemberDto(member));
    }
  }

  return dto;
}

export function messageDto(message) {
  let dto = {
    id: message?.id,
    messageId: message?.message_id,
    senderId: message?.sender_id,
    message: message?.message,
    type: message?.type,
    channelId: message?.channel_id,
    createdAt: message?.createdAt,
    updatedAt: message?.updatedAt,
    user: null,
    channel: null,
  };

  if (message?.user?.id) {
    dto.user = userDto(message?.user);
  }

  if (message?.channel?.id) {
    dto.channel = channelDto(message?.channel);
  }
  return dto;
}

export function messagesDto(messages) {
  let dto = [];

  if (messages?.length >= 1) {
    for (let message of messages) {
      dto.push(messageDto(message));
    }
  }

  return dto;
}
