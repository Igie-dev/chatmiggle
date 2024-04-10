/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { getToken } from "@/lib/helper";
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
    } catch (error) {
      console.log(error);
    }
  },
});

export const asycnEmit = (emitName: string, emitData: any) => {
  return new Promise((resolve, reject) => {
    socket.emit(emitName, emitData);
    socket.on(emitName, (res: any) => {
      if (res.error) {
        reject("Error");
      }

      resolve(res);
      socket.off(emitName);
    });
  });
};

export const asyncOn = (listener: string) => {
  return new Promise((resolve, reject) => {
    socket.on(listener, (res: any) => {
      if (res.error) {
        reject("Error");
      }
      resolve(res);
      socket.off(listener);
    });
  });
};
