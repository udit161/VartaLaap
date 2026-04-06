import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is not defined in environment variables!");
            return;
        }
        if (mongoose.connection.readyState >= 1) return;
        
        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export default connectMongoDB;