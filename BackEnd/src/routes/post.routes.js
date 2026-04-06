import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/post.constrollers.js";





const router = express.Router();


router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
























export default router;