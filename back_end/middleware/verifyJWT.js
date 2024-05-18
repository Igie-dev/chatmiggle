import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { ignoreExpiration: false, audience: `${audience}`, issuer: `${issuer}` },
    (err, decoded) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user_id = decoded.User.user_id;
      next();
    }
  );
};

export default verifyJWT;
