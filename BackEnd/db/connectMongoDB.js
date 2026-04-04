import mongoose from "mongoose";
const connectMongoDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export default connectMongoDB;