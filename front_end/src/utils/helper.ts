import CryptoJS from "crypto-js";
import store from "@/service/store"
export const decryptText = (text: string): string => {
	const decData = CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
	const bytes = CryptoJS.AES.decrypt(
		decData,
		`${import.meta.env.VITE_SECRET_KEY}`
	).toString(CryptoJS.enc.Utf8);
	return JSON.parse(bytes);
};

export const encryptText = (text: string): string => {
	const encJson = CryptoJS.AES.encrypt(
		JSON.stringify(text),
		`${import.meta.env.VITE_SECRET_KEY}`
	).toString();
	const encData = CryptoJS.enc.Base64.stringify(
		CryptoJS.enc.Utf8.parse(encJson)
	);
	return encData;
};

export async function getToken() {
	const token =  store.getState().auth.token;
	return token;
}
