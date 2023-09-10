import express from "express";
import cors from "cors";
import { router as adminRouter } from "./routes/admin";
import { router as userRouter } from "./routes/user";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.use(express.static("public"));
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => console.log("Server running on 3000"));