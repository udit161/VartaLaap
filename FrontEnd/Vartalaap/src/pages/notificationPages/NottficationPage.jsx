import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

const typeIcons = {
  follow: "👤",
  like: "❤️",
  comment: "💬",
  unfollow: "👋",
};

const NotificationsFeed = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const visibleNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.read);

  return (
    <div className="right">
      <div className="right-inner">
        <div className="feed-header">
          <h2>Notifications</h2>
          <div className="tabs">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Notifications
            </button>
            <button
              className={activeTab === "unread" ? "active" : ""}
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </button>
          </div>
        </div>
        <div className="post-list">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading notifications...</p>
          ) : visibleNotifications.length === 0 ? (
            <p className="no-notifications" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No notifications</p>
          ) : (
            visibleNotifications.map((notif) => (
              <article key={notif._id} className="post-card" style={{ opacity: notif.read ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                <div className="post-card-header">
                  <span className="author">
                    {typeIcons[notif.type] || "🔔"} {notif.from?.username ? `@${notif.from.username}` : "Someone"}
                  </span>
                  <span className="post-time">{getTimeAgo(notif.createdAt)}</span>
                  {!notif.read && <span className="admired">New</span>}
                </div>
                <p>
                  {notif.type === "follow" && `started following you`}
                  {notif.type === "like" && `liked your post`}
                  {notif.type === "comment" && `commented on your post`}
                  {notif.type === "unfollow" && `unfollowed you`}
                </p>
                <button
                  onClick={() => handleDelete(notif._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9CA3AF",
                    cursor: "pointer",
                    fontSize: "12px",
                    marginTop: "4px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => e.target.style.color = "#ff6b6b"}
                  onMouseOut={(e) => e.target.style.color = "#9CA3AF"}
                >
                  Dismiss
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  return (
    <DashboardLayout>
      <NotificationsFeed />
    </DashboardLayout>
  );
};

export default NotificationPage;
