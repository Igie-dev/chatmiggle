/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/helper";
const URL =
  import.meta.env.NODE_ENV === "production"
    ? undefined
    : import.meta.env.VITE_SERVER_URL;

export const socket: Socket = io(URL, {
  auth: async (cb) => {
    try {
      const token = await getToken();
      if (token) {
        cb({ token: `${token}` });
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  },
});
export const asyncEmit = (emitName: string, emitData: any) => {
  return new Promise((resolve, reject) => {
    const onResponse = (res: any) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res);
      }
      socket.off(emitName, onResponse); // Remove the listener after handling the response
    };

    socket.on(emitName, onResponse);
    socket.emit(emitName, emitData);
  });
};

export const asyncOn = (listener: string) => {
  return new Promise((resolve, reject) => {
    socket.on(listener, (res: any) => {
      if (res.error) {
        reject(res.error);
      }
      resolve(res);
      socket.off(listener);
    });
  });
};
