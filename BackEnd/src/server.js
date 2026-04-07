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
import { fileURLToPath } from "url";

// Resolve .env from the project root (two levels up from BackEnd/src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

console.log("ENV loaded. MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("ENV loaded. JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("ENV loaded. Client_ID exists:", !!process.env.Client_ID);

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5001;

// CORS: allow the Render deployment URL and localhost in development
const allowedOrigins = [
    'https://vartalaap009.onrender.com',
    'http://localhost:5000',
    'http://localhost:5001',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const frontendDist = path.resolve(__dirname, "../../FrontEnd/Vartalaap/dist");
    app.use(express.static(frontendDist));

    // Catch-all: send index.html so React Router handles all non-API routes
    app.use((req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectMongoDB();
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

startServer();

export default app;
