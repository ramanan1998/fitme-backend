import express, { Request, response, Response } from "express";
import cors from "cors";
import mainRoutes from "./routes/main";
import authRoutes from "./routes/auth";
import "dotenv/config";
import { connectDB } from "./middleware/connectDB";

connectDB();
const PORT = 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript with Express!");
});

app.use("/api/user", authRoutes);
app.use("/api/tryon", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
