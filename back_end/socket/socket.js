import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

//Config
const socketConnection = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: audience,
		},
	});

	//Middleware
	io.use(async (socket, next) => {
		const token = socket.handshake.auth.token;
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			{
				ignoreExpiration: false,
				audience: `${audience}`,
				issuer: `${issuer}`,
			},
			(err, decoded) => {
				if (err) return;
				if (decoded.UserInfo.userId) next();
			}
		);
	});

	//Connection
	io.on("connection", (socket) => {
		console.log("Socket connnected");
		socket.on("registerUser", async (userId) => {
			socket.join(userId);
		});
	});
};

export default socketConnection;
