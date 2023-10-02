"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.SECRET || "";
function authenticationJWTToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ "message": "missing auth header" });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ err });
        }
        if (!payload) {
            return res.status(403).json({ message: "payload undefined" });
        }
        if (typeof payload === "string") {
            return res.status(403).json({ "message": "payload string" });
        }
        req.headers["userId"] = payload.id;
        next();
    });
}
exports.default = authenticationJWTToken;
