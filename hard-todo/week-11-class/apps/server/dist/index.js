"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("./routes/admin");
const user_1 = require("./routes/user");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_1.router);
app.use("/user", user_1.router);
app.use(express_1.default.static("public"));
app.use("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public/index.html"));
});
app.listen(3000, () => console.log("Server running on 3000"));
