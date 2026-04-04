import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./yourProfile.css";

const OtherProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch current logged-in user
                const meRes = await fetch("/api/auth/me", { credentials: "include" });
                let meData = null;
                if (meRes.ok) {
                    meData = await meRes.json();
                    setAuthUser(meData);
                }

                // Try to fetch user by username first, then by ID
                const profileRes = await fetch(`/api/users/profile/${userId}`, { credentials: "include" });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setUser(profileData);

                    // Check if we're following this user
                    if (meData && profileData.followers) {
                        setIsFollowing(profileData.followers.includes(meData._id));
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setIsFollowing(!isFollowing);
                setUser((prev) => ({
                    ...prev,
                    followers: isFollowing
                        ? prev.followers.filter((id) => id !== authUser?._id)
                        : [...prev.followers, authUser?._id],
                }));
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="right">
                    <div className="right-inner profile-page-inner" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <p style={{ color: "#9CA3AF", padding: "3rem" }}>Loading profile...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="right">
                    <div className="right-inner profile-page-inner" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>
                            <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>😕</span>
                            <p>User not found.</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="right">
                <div className="right-inner profile-page-inner">
                    {/* Cover & Avatar */}
                    <div className="profile-cover">
                        <div className="profile-cover-gradient">
                            {user.coverImg && (
                                <img src={user.coverImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                            )}
                        </div>
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {user.profileImg ? (
                                    <img src={user.profileImg} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                ) : "👤"}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="profile-info-section">
                        <h1 className="profile-name">{user.fullName}</h1>
                        <span className="profile-handle">@{user.username}</span>
                        <p className="profile-bio">{user.bio || "No bio yet."}</p>

                        {/* Follow Button */}
                        <button
                            className={`follow-profile-btn ${isFollowing ? "following" : ""}`}
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? "Following ✓" : "Follow"}
                        </button>

                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">{user.followers?.length || 0}</span>
                                <span className="stat-label">Followers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{user.following?.length || 0}</span>
                                <span className="stat-label">Following</span>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-icon">📧</span>
                                <span>{user.email}</span>
                            </div>
                            {user.links && (
                                <div className="detail-row">
                                    <span className="detail-icon">🔗</span>
                                    <span>{user.links}</span>
                                </div>
                            )}
                            {user.projects && (
                                <div className="detail-row">
                                    <span className="detail-icon">🚀</span>
                                    <span>{user.projects}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OtherProfile;
