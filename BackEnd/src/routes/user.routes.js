import express from "express";
import { getUserProfile, followUnfollowUser, updateUserProfile, getSuggestedUsers } from "../controllers/user.contollers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

router.get("/remove-tests", async (req, res) => {
    try {
        const User = (await import("../models/user.Models.js")).default;
        const result = await User.deleteMany({ username: /test/i });
        res.json({ message: "Test users removed", count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);

export default router;








