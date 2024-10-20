// DEPENDENCIES
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// Secrets
const PORT = process.env.PORT || 4001;
// Configuration to convert JSON payloads to JS objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS options configuration
const corsOptions = {
    origin: ["*"],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
if (require.main === module) {
    app.listen(PORT || 4005, () => {
        console.log(`API is now online on port ${PORT || 4005}`);
    });
}
module.exports = { app };
