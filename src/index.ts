import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const app = express();

app.use(cors({
    origin: `http://${SERVER_HOSTNAME}:${CLIENT_PORT}`
}));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port http://${SERVER_HOSTNAME}:${SERVER_PORT}`);
});



