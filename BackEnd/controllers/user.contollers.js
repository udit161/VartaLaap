import User from "../models/user.Models.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notifications.models.js";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        let user;
        
        // Try to find by username or by ID if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(username)) {
            user = await User.findById(username).select("-password");
        } 
        
        if (!user) {
            user = await User.findOne({ username }).select("-password");
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in getUserProfile:", error.message);
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user._id.toString() || id === req.user.username) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        const userToModify = await User.findOne({ $or: [{ _id: id }, { username: id }] });
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser)
            return res.status(404).json({ error: "User not Found " });

        const isFollowing = currentUser.following.some(f => f.equals(userToModify._id));

        if (isFollowing) {
            // unfollow the user

            await User.findByIdAndUpdate(userToModify._id, {
                $pull: { followers: req.user._id }
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: userToModify._id }
            });

            // this line of code send the notifications to the user when someone unfollows them
            res.status(200).json({ message: "UnFollowed The User Successfully" });

        } else {
            // follow the user  
            await User.findByIdAndUpdate(userToModify._id, {
                $push: { followers: req.user._id }

            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: userToModify._id }
            });

            // this line of code send the notifications to the user when someone follows them
            const newNotification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: "follow",
            });
            await newNotification.save();

            res.status(200).json({ message: "Followed The User Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in followUnfollowUser:", error.message);
    }
}

export const updateUserProfile = async (req, res) => {
    let { fullName, bio, projects, links, currentPassword, newPassword } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Both current and new passwords are required to change password" });
        }
        if (currentPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                const publicId = user.profileImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            user.profileImg = profileImg;
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            user.profileImg = uploadedResponse.secure_url;

        }
        if (coverImg) {
            if (user.coverImg) {
                const publicId = user.coverImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            user.coverImg = coverImg;
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            user.coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        user.projects = projects || user.projects;
        user.links = links || user.links;
        user.password = newPassword ? user.password : user.password;
        user.email = user.email;

        const updatedUser = await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            bio: updatedUser.bio,
            projects: updatedUser.projects,
            links: updatedUser.links,
            profileImg: updatedUser.profileImg,
            coverImg: updatedUser.coverImg
        });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}



export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const userFollowed = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: {
                        $ne: new mongoose.Types.ObjectId(userId),
                        $nin: userFollowed.following,
                    },
                }
            },
            { $sample: { size: 10 } }
        ]);

        const SuggestedUsers = users.slice(0, 5);

        SuggestedUsers.forEach(user => user.password = null);
        res.status(200).json(SuggestedUsers);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in getSuggestedUsers:", error.message);
    }
}

