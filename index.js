// DEPENDENCIES
const express = require("express");
const fs = require("fs");
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
// Data Storage Functions
const loadUsers = () => {
    try {
        const data = fs.readFileSync("./usersData.json");
        return JSON.parse(data);
    } catch (error) {
        console.error("Passed to error handler.");
        errorHandler(error, req, res);
    }
};
// Initialize in-memory storage
const users = loadUsers();
const saveUsers = () => {
    try {
        fs.writeFileSync("./usersData.json", JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Passed to error handler.");
        errorHandler(error, req, res);
    }
};
// Error handling
const errorHandler = async (error, req, res, next) => {
    const statusCode = error.status || 500;
    const errorMessage = error.message || "An unexpected error has occurred.";
    console.error(JSON.stringify({ name: error.name, message: error.message, stack: error.stack, cause: error.cause, code: error.code, path: error.path, errno: error.errno, type: error.type }, null, 2));
    res.status(statusCode).send({ error: errorMessage });
};
if (require.main === module) {
    app.listen(PORT || 4005, () => {
        console.log(`API is now online on port ${PORT || 4005}`);
    });
}
module.exports = { app };
