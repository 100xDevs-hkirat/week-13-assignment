"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET = "SECr3t";
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!user || typeof user === "string") {
                return res.sendStatus(403);
            }
            req.headers["username"] = user.username;
            req.headers["role"] = user.role;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
