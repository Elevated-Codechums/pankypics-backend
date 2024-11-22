import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import poolDB from "./config/database.js";
import authRouter from "./routers/authRouters.js";
import { checkAdmin } from "./middleware/authMiddleware.js";
import cookieparser from "cookie-parser";
import uploadRouter from "./routers/uploadRouters.js";
import albumsRouter from "./routers/albumRouters.js";
dotenv.config();



const SERVER_PORT = process.env.SERVER_PORT || 4000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const app = express();


//middleware
app.use(cors({
    origin: `http://${SERVER_HOSTNAME}:${CLIENT_PORT}`,
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());


//routes
app.get('*', checkAdmin);
app.get("/", async (req, res) => {
    try {
        const admin = await poolDB.query("SELECT * FROM admin");
        res.json(admin.rows); 
    } catch (error) {
        console.log(error);
    }
});



app.use(authRouter);

app.use(uploadRouter);

app.use(albumsRouter);


app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port http://${SERVER_HOSTNAME}:${SERVER_PORT}`);
});



