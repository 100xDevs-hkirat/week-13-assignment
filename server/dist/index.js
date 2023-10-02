"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const todo_1 = __importDefault(require("./routes/todo"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    return res.status(200).json({ message: "hello!" });
});
app.use('/user', auth_1.default);
app.use('/todo', todo_1.default);
app.listen(PORT, () => {
    console.log(`app is listening at ${PORT}`);
});
