import express, { Request, Response } from "express";
import cors from "cors";

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
