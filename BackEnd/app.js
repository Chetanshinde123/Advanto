import express from "express";
import axios from "axios";
import cors from "cors";
import dbConnect from "./config/dbconnect.js";
import dotenv from "dotenv";
import router from "./routes/transactionRoute.js";
dotenv.config();

dbConnect();
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.use("/api", router);

app.listen(port, () => {
  console.log("Server running at ", port);
});
