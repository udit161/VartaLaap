import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./post.css";

const PostPage = () => {
    const [postText, setPostText] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch the current user and their posts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const meRes = await fetch("/api/auth/me", { credentials: "include" });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    setAuthUser(meData);

                    // Fetch posts by this user
                    const postsRes = await fetch(`/api/posts/user/${meData.username}`, { credentials: "include" });
                    if (postsRes.ok) {
                        const postsData = await postsRes.json();
                        setMyPosts(postsData);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setFilePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePost = async () => {
        if (!postText.trim() && !selectedFile) return;
        setIsPosting(true);

        try {
            const body = {};
            if (postText.trim()) body.text = postText;
            if (filePreview) body.img = filePreview;

            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                // Add the new post to the top of the list
                const newPost = data.post;
                if (newPost) {
                    newPost.user = authUser; // attach user info for display
                    setMyPosts([newPost, ...myPosts]);
                }
                setPostText("");
                removeMedia();
            } else {
                alert(data.error || "Failed to create post");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setMyPosts(myPosts.filter((p) => p._id !== postId));
            }
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

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

    return (
        <DashboardLayout hideSuggested>
            <div className="post-page-layout">
                {/* Composer Panel */}
                <div className="post-panel post-composer-panel">
                    <div className="post-composer">
                        <h2 className="composer-title">What happened...</h2>
                        <div className="composer-body">
                            <textarea
                                className="composer-input"
                                placeholder="Share what's on your mind..."
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                rows={5}
                            />

                            {filePreview && (
                                <div className="media-preview">
                                    {selectedFile?.type.startsWith("video") ? (
                                        <video src={filePreview} controls className="preview-media" />
                                    ) : (
                                        <img src={filePreview} alt="Preview" className="preview-media" />
                                    )}
                                    <button className="remove-media-btn" onClick={removeMedia}>✕</button>
                                </div>
                            )}

                            <div className="composer-actions">
                                <div className="media-buttons">
                                    <button
                                        className="media-btn"
                                        onClick={() => { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); }}
                                        title="Add Photo"
                                    >
                                        🖼️ <span>Photo</span>
                                    </button>
                                    <button
                                        className="media-btn"
                                        onClick={() => { fileInputRef.current.accept = "video/*"; fileInputRef.current.click(); }}
                                        title="Add Video"
                                    >
                                        🎬 <span>Video</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileSelect}
                                    />
                                </div>
                                <button
                                    className="post-submit-btn"
                                    onClick={handlePost}
                                    disabled={(!postText.trim() && !selectedFile) || isPosting}
                                >
                                    {isPosting ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Posts Panel */}
                <div className="post-panel your-posts-panel">
                    <div className="your-posts-section">
                        <h2 className="your-posts-title">Your Posts</h2>
                        <div className="post-list your-post-list">
                            {loading ? (
                                <p className="no-posts-text">Loading your posts...</p>
                            ) : myPosts.length === 0 ? (
                                <p className="no-posts-text">You haven't posted anything yet.</p>
                            ) : (
                                myPosts.map((post) => (
                                    <article key={post._id} className="post-card my-post-card">
                                        <div className="post-card-header">
                                            <span className="author">@{authUser?.username || "you"}</span>
                                            <span className="post-time">{getTimeAgo(post.createdAt)}</span>
                                            <button
                                                className="post-type-badge"
                                                style={{ cursor: "pointer", background: "none", border: "none", fontSize: "16px" }}
                                                title="Delete post"
                                                onClick={() => handleDeletePost(post._id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        {post.text && <p>{post.text}</p>}
                                        {post.img && (
                                            <img
                                                src={post.img}
                                                alt="Post media"
                                                className="post-media-img"
                                            />
                                        )}
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PostPage;
