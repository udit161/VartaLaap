import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./peoples.css";

const UserCard = ({ user, actionLabel, actionClass, onAction, onCardClick, loading }) => (
    <div className="peoples-user-card" onClick={onCardClick} style={{ cursor: "pointer" }}>
        <div className="peoples-avatar">
            {user.profileImg ? (
                <img src={user.profileImg} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            ) : "👤"}
        </div>
        <div className="peoples-user-info">
            <span className="peoples-user-name">{user.fullName || user.username}</span>
            <span className="peoples-user-handle">@{user.username}</span>
            <span className="peoples-user-bio">{user.bio || ""}</span>
        </div>
        <button
            className={`peoples-action-btn ${actionClass}`}
            disabled={loading}
            onClick={(e) => { e.stopPropagation(); onAction(); }}
        >
            {actionLabel}
        </button>
    </div>
);

const PeoplesPage = () => {
    const navigate = useNavigate();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("followed");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current user to get following list
                const meRes = await fetch("/api/auth/me", { credentials: "include" });
                if (meRes.ok) {
                    const meData = await meRes.json();

                    // Fetch profiles of users we follow
                    if (meData.following && meData.following.length > 0) {
                        const followedProfiles = [];
                        for (const followId of meData.following) {
                            try {
                                const profileRes = await fetch(`/api/users/profile/${followId}`, { credentials: "include" });
                                if (profileRes.ok) {
                                    const profileData = await profileRes.json();
                                    followedProfiles.push(profileData);
                                }
                            } catch {
                                // skip failed profile fetches
                            }
                        }
                        setFollowedUsers(followedProfiles);
                    }
                }

                // Fetch suggested users
                const suggestedRes = await fetch("/api/users/suggested", { credentials: "include" });
                if (suggestedRes.ok) {
                    const suggestedData = await suggestedRes.json();
                    setSuggestedUsers(suggestedData);
                }
            } catch (err) {
                console.error("Error fetching peoples:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFollow = async (userId) => {
        setActionLoading(userId);
        try {
            const res = await fetch(`/api/users/follow/${userId}`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                const user = suggestedUsers.find((u) => u._id === userId);
                setSuggestedUsers((prev) => prev.filter((u) => u._id !== userId));
                if (user) setFollowedUsers((prev) => [...prev, user]);
            }
        } catch (err) {
            console.error("Error following user:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnfollow = async (userId) => {
        setActionLoading(userId);
        try {
            const res = await fetch(`/api/users/follow/${userId}`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                const user = followedUsers.find((u) => u._id === userId);
                setFollowedUsers((prev) => prev.filter((u) => u._id !== userId));
                if (user) setSuggestedUsers((prev) => [...prev, user]);
            }
        } catch (err) {
            console.error("Error unfollowing user:", err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="right">
                <div className="right-inner peoples-page-inner">
                    <div className="feed-header">
                        <h2>People</h2>
                        <div className="tabs">
                            <button
                                className={activeTab === "followed" ? "active" : ""}
                                onClick={() => setActiveTab("followed")}
                            >
                                Following
                            </button>
                            <button
                                className={activeTab === "suggested" ? "active" : ""}
                                onClick={() => setActiveTab("suggested")}
                            >
                                Suggested
                            </button>
                        </div>
                    </div>

                    <div className="peoples-list">
                        {loading ? (
                            <div className="peoples-empty">
                                <p>Loading...</p>
                            </div>
                        ) : activeTab === "followed" ? (
                            followedUsers.length === 0 ? (
                                <div className="peoples-empty">
                                    <span>😶</span>
                                    <p>You're not following anyone yet.</p>
                                </div>
                            ) : (
                                followedUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        actionLabel="Unfollow"
                                        actionClass="unfollow"
                                        loading={actionLoading === user._id}
                                        onAction={() => handleUnfollow(user._id)}
                                        onCardClick={() => navigate(`/user/${user.username}`)}
                                    />
                                ))
                            )
                        ) : (
                            suggestedUsers.length === 0 ? (
                                <div className="peoples-empty">
                                    <span>🎉</span>
                                    <p>No more suggestions!</p>
                                </div>
                            ) : (
                                suggestedUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        actionLabel="Follow"
                                        actionClass="follow"
                                        loading={actionLoading === user._id}
                                        onAction={() => handleFollow(user._id)}
                                        onCardClick={() => navigate(`/user/${user.username}`)}
                                    />
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PeoplesPage;
