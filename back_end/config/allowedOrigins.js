import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = [`${process.env.CLIENT_URL}`];

export default allowedOrigins;
