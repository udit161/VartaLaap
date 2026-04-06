import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications, deleteNotification } from "../api/controllers/notification.controllers.js";



const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:id", protectRoute, deleteNotification);





export default router;