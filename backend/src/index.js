import dotenv from "dotenv"
import app from "./app.js";
import connectDB from "./db/index.js"
import { PORT } from "./constants.js";

dotenv.config({
    path: "./env"
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Ready at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(`Error while connect with server ${error}`);
    })