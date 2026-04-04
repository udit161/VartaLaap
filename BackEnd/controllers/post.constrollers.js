import User from "../models/user.Models.js";
import Post from "../models/post.models.js";
import { v2 as cloudinary } from "cloudinary";
import Notifications from "../models/notifications.models.js";



export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();



        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ error: "Post must contain text or image" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        });
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", post: newPost });


    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Failed to create post" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);

        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
        console.error("Error deleting post:", error);
    }
}

export const likeUnlikePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user._id.toString();

        if (!postId) {
            return res.status(400).json({ error: "Post not found" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            return res.status(200).json({ message: "Post Unliked" });
        } else {
            post.likes.push(userId);
            await post.save();
            await User.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } });

            const notification = new Notifications({
                from: req.user._id,
                to: post.user,
                type: "like",
            });
            await notification.save();

            return res.status(200).json({ message: "Post Liked" });
        }


    } catch (error) {
        return res.status(500).json({ error: "Server Error Problem" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id.toString();
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = {
            text,
            user: userId
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
        console.error("Error adding comment:", error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        // Return empty array when no posts exist instead of 404 for consistent client behavior
        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts : ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(likedPosts);

    } catch (error) {

        console.log("Error in getLikedPosts controllers: ", error);

        res.status(500).json({ error: "Internal Server Error" });

    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })

            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in getFollowingPosts Controllers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "User Not Found" })

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(posts);
    } catch (error) {
        console.log(" Error in GetUserPosts:", error);
        res.status(500).json({ error: "Internal server error" });


    }
}
