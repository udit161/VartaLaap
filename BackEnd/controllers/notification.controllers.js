import Notification from "../models/notifications.models.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username profileImg"
            })
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in getNotifications controllers: ", error);


    }
}

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ error: "Notification Not Found" });
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ message: "Notification Deleted Successfully " });


    } catch (error) {
        console.log("Error in DeleteNotitfication fuction: ", error);
        res.status(500).json({ error: "Internal server error" });

    }
}