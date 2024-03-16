import allowedOrigins from "./allowedOrigins.js";
const corsOptions = {
	origin: (origin, callback) => {
		if (true) {
			callback(null, true);
		} else {
			callback(new Error("Not Allowed by Cors"));
		}
	},
	credentials: true, // Corrected spelling here
	optionsSuccessStatus: 200,
};

export default corsOptions;
