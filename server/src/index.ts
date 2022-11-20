import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
var cors = require('cors')

import AuthRoute from "./routes/AuthRoute";
import vaccineController from "./controllers/VaccineController";
import AuthMiddleware from "./middlewares/AuthMiddleware";

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:7000"
app.use(cors({
    origin: [FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200
}))


app.get("/vaccine", [AuthMiddleware], vaccineController.index)
app.post("/vaccine", [AuthMiddleware], vaccineController.store)
app.put("/vaccine/:id", [AuthMiddleware], vaccineController.update)
app.delete("/vaccine/:id", [AuthMiddleware], vaccineController.delete)
app.delete("/patient/:id", [AuthMiddleware], vaccineController.delete)

app.use("/", AuthRoute)

export default app

if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at ${PORT}`));
}