import User from "../models/user.Models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/generateTokens.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

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

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                message: "User registered successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,

            });

        } else {
            res.status(400).json({ error: "Failed to create user" });
        }





    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error" });

    }
}
export const login = async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                error:
                    "Invalid username or password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user?.password || "");
        if (!isPasswordMatch) {
            return res.status(400).json({
                error:
                    "Invalid username or password"
            });
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
        })

    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error" });

    }

};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {

            maxAge: 0,
        })
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Internal server error" });
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
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error" });
    }

}



