console.log("Starting server...");
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import dns from "dns"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";
import postRoutes from "./routes/post.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import path from "path";




dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
const __dirname = path.resolve();

// console.log(process.env.MONGO_URI);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));// to parse the data
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/FrontEnd/Vartalaap/dist")));
    app.get("/*splat", (req, res) => {
        res.sendFile(path.resolve(__dirname, "FrontEnd", "Vartalaap", "dist", "index.html"));
    });
}

const startServer = async () => {
    await connectMongoDB();
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
};

startServer();
