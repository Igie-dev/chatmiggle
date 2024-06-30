/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
	name: "channel",
	initialState: {
		channelId: "",
		adminId: "",
		members: [],
		avatarId: "",
		channelName: ""
	},
	reducers: {
		setCurrentChannel: (state, action) => {
			const { channelId, members, adminId, avatarId, channelName } = action.payload;
			state.channelId = channelId;
			state.adminId = adminId;
			state.members = members;
			state.avatarId = avatarId;
			state.channelName = channelName
		},

		removeCurrentChannel: (state) => {
			state.adminId = "";
			state.channelId = "";
			state.members = [];
			state.avatarId = "";
			state.channelName = "";
		}
	},
});

export const {
	setCurrentChannel,
	removeCurrentChannel
} = channelSlice.actions;

export const getCurrentChannelId = (state: any) => state.channel.channelId;
export const getCurrentChanneMembers = (state: any) => state.channel.members;
export const getCurrentChannelAdminId = (state: any) => state.channel.adminId;
export const getCurrentChannelAvatar = (state: any) => state.channel.avatarId;
export const getCurrentChannelName = (state: any) => state.channel.channelName;
export default channelSlice.reducer;
