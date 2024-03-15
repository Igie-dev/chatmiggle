/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
	name: "channel",
	initialState: {
		channelId: null,
		members: [],
	},
	reducers: {
		setCurrentChannelId: (state, action) => {
			const channelId = action.payload;
			state.channelId = channelId;
		},

		setCurrentChannelMembers: (state, action) => {
			const members = action.payload;
			state.members = members;
		},

		removeCurrentChannelId: (state) => {
			state.channelId = null;
		},
		removeCurrentChannelMembers: (state) => {
			state.members = [];
		},
	},
});

export const {
	setCurrentChannelId,
	setCurrentChannelMembers,
	removeCurrentChannelId,
	removeCurrentChannelMembers,
} = channelSlice.actions;

export const getCurrentChannelId = (state: any) => state.channel.channelId;
export const getCurrentChanneMember = (state: any) => state.channel.members;
export default channelSlice.reducer;
