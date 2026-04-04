import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./yourProfile.css";

const YourProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setEditData(data);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/users/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    fullName: editData.fullName,
                    bio: editData.bio,
                    projects: editData.projects,
                    links: editData.links,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setProfile({ ...profile, ...data });
                setIsEditing(false);
            } else {
                setError(data.error || "Failed to update profile");
            }
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profile });
        setIsEditing(false);
        setError("");
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

    if (!profile) {
        return (
            <DashboardLayout>
                <div className="right">
                    <div className="right-inner profile-page-inner" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>
                            <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>🔒</span>
                            <p>Please log in to view your profile.</p>
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
                            {profile.coverImg && (
                                <img src={profile.coverImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                            )}
                        </div>
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {profile.profileImg ? (
                                    <img src={profile.profileImg} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                ) : "👤"}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="profile-info-section">
                        {!isEditing ? (
                            <>
                                <h1 className="profile-name">{profile.fullName}</h1>
                                <span className="profile-handle">@{profile.username}</span>
                                <p className="profile-bio">{profile.bio || "No bio yet."}</p>

                                <div className="profile-stats">
                                    <div className="stat">
                                        <span className="stat-number">{profile.followers?.length || 0}</span>
                                        <span className="stat-label">Followers</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">{profile.following?.length || 0}</span>
                                        <span className="stat-label">Following</span>
                                    </div>
                                </div>

                                <div className="profile-details">
                                    <div className="detail-row">
                                        <span className="detail-icon">📧</span>
                                        <span>{profile.email}</span>
                                    </div>
                                    {profile.links && (
                                        <div className="detail-row">
                                            <span className="detail-icon">🔗</span>
                                            <span>{profile.links}</span>
                                        </div>
                                    )}
                                    {profile.projects && (
                                        <div className="detail-row">
                                            <span className="detail-icon">🚀</span>
                                            <span>{profile.projects}</span>
                                        </div>
                                    )}
                                </div>

                                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <div className="profile-edit-form">
                                {error && (
                                    <div style={{
                                        backgroundColor: "rgba(255, 31, 31, 0.15)",
                                        border: "1px solid rgba(255, 31, 31, 0.4)",
                                        borderRadius: "8px",
                                        padding: "10px 14px",
                                        marginBottom: "16px",
                                        color: "#ff6b6b",
                                        fontSize: "14px",
                                    }}>
                                        {error}
                                    </div>
                                )}
                                <div className="edit-row">
                                    <label>Name</label>
                                    <input className="edit-input" value={editData.fullName || ""} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} />
                                </div>
                                <div className="edit-row">
                                    <label>Bio</label>
                                    <textarea className="edit-input edit-textarea" value={editData.bio || ""} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} />
                                </div>
                                <div className="edit-row">
                                    <label>Projects</label>
                                    <input className="edit-input" value={editData.projects || ""} onChange={(e) => setEditData({ ...editData, projects: e.target.value })} />
                                </div>
                                <div className="edit-row">
                                    <label>Links</label>
                                    <input className="edit-input" value={editData.links || ""} onChange={(e) => setEditData({ ...editData, links: e.target.value })} />
                                </div>
                                <div className="edit-actions">
                                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default YourProfile;
