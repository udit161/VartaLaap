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
if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]); // Helps resolve MongoDB Atlas SRV records in some environments
}

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
    origin: true, // Allow all origins in production to avoid CORS issues with Vercel domains
    credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));// to parse the data
app.use(cookieParser());

// Connection middleware for Vercel serverless environment
app.use(async (req, res, next) => {
    await connectMongoDB();
    next();
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);




// if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
//     app.use(express.static(path.join(__dirname, "dist")));
//     app.get("/*splat", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "dist", "index.html"));
//     });
// }

const startServer = async () => {
    try {
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            await connectMongoDB();
            app.listen(PORT, () => {
                console.log(`server is running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

startServer();

export default app;
