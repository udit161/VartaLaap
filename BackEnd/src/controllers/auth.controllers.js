import User from "../models/user.Models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/generateTokens.js";
import { OAuth2Client } from "google-auth-library";

const getClient = () => {
    if (!process.env.Client_ID) {
        throw new Error("FATAL: Client_ID environment variable is not set!");
    }
    return new OAuth2Client(process.env.Client_ID);
};

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Validate all required fields exist
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required: fullName, username, email, password" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            message: "User registered successfully",
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
            bio: newUser.bio,
        });

    } catch (error) {
        console.error("Error during signup:", error);
        // ALWAYS show the real error so we can debug
        res.status(500).json({ error: "Signup failed: " + error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user?.password || "");
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            message: "Login successful",
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed: " + error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("jwt", "", {
            httpOnly: true,
            maxAge: 0,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Logout failed: " + error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user: " + error.message });
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: "Google credential token is required" });
        }

        const client = getClient();
        
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.Client_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ error: "Google account does not have an email address" });
        }
        
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            // User exists, log them in
            generateTokenAndSetCookie(user._id, res);
            return res.status(200).json({
                message: "Login successful",
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profileImg: user.profileImg,
                followers: user.followers,
                following: user.following,
                coverImg: user.coverImg,
                bio: user.bio,
            });
        }
        
        // User does not exist, create new account
        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        
        // Generate a unique username
        let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let username = baseUsername;
        let suffix = 1;
        while (await User.findOne({ username })) {
            username = `${baseUsername}${suffix}`;
            suffix++;
        }
        
        const newUser = new User({
            fullName: name || "Google User",
            username,
            email,
            password: hashedPassword,
            profileImg: picture || "",
        });
        
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);
        
        return res.status(201).json({
            message: "User registered successfully",
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            profileImg: newUser.profileImg,
            followers: newUser.followers,
            following: newUser.following,
            coverImg: newUser.coverImg,
            bio: newUser.bio,
        });

    } catch (error) {
        console.error("Error in googleAuth controller:", error);
        return res.status(500).json({ error: "Google auth failed: " + error.message });
    }
};
