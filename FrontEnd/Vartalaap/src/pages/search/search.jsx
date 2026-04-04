import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./search.css";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users/suggested", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setAllUsers(data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = query.trim()
        ? allUsers.filter(
            (u) =>
                (u.fullName || "").toLowerCase().includes(query.toLowerCase()) ||
                (u.username || "").toLowerCase().includes(query.toLowerCase())
        )
        : allUsers;

    return (
        <DashboardLayout>
            <div className="right">
                <div className="right-inner search-page-inner">
                    {/* Search Bar */}
                    <div className="search-header">
                        <h2 className="search-title">Search Users</h2>
                        <div className="search-bar-wrapper">
                            <span className="search-bar-icon">🔍</span>
                            <input
                                type="text"
                                className="search-bar-input"
                                placeholder="Search by name or @username..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            {query && (
                                <button className="search-clear-btn" onClick={() => setQuery("")}>
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="search-results">
                        {loading ? (
                            <div className="no-results">
                                <p>Loading users...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="no-results">
                                <span className="no-results-icon">😕</span>
                                <p>No users found{query ? <> for "<strong>{query}</strong>"</> : ""}</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user._id} className="search-user-card" onClick={() => navigate(`/user/${user.username}`)} style={{ cursor: 'pointer' }}>
                                    <div className="search-avatar">
                                        {user.profileImg ? (
                                            <img src={user.profileImg} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                                        ) : "👤"}
                                    </div>
                                    <div className="search-user-info">
                                        <span className="search-user-name">{user.fullName || user.username}</span>
                                        <span className="search-user-handle">@{user.username}</span>
                                        <span className="search-user-bio">{user.bio || ""}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SearchPage;
