import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//get request for home page of server
router.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
