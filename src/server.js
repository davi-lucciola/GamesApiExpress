import express from "express";
import cors from "cors";
import { router as gameRouter } from "./controllers/games.js";
import { router as userRouter } from "./controllers/users.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(gameRouter);
app.use(userRouter);

app.get("/info", async (req, res) => {
  return res.json({
    title: "games-api-express",
    by: "Davi Lucciola",
  });
});

app.listen(3030, () =>
  console.log("Server is running at: http://localhost:3030")
);
