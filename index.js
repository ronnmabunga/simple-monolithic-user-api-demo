// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();
// Secrets
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET;
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
const decodeToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (typeof token !== "string" || token.length < 8) {
            console.log("No Token Found. Authentication Failed.");
            next();
            return;
        }
        token = token.slice(7, token.length);
        jwt.verify(token, JWT_SECRET, async function (err, decodedToken) {
            log.variables["err"] = err;
            log.variables["decodedToken"] = decodedToken;
            if (err) {
                console.log("Token Verification Failed. Authentication Failed.");
                next();
            } else {
                let isValidUser = checkValidUser(decodedToken);
                if (isValidUser) {
                    console.log("Token Verification Successful. User Verification Successful.");
                    req.user = decodedToken;
                    next();
                } else {
                    console.log("Token Verification Successful. User Verification Failed.");
                    next();
                }
            }
        });
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
