import React, { useState, useEffect } from "react";
import "./homepage.css";
import { SpaceBackground } from "../../components/SpaceBackground";
import { useNavigate } from "react-router-dom";

const iconAssets = {
  home: "/home-svg.svg",
  friends: "/friends-svg.svg",
  notifications: "/notifications-svg.svg",
  posts: "/posts-svg.svg",
  search: "/search-svg.svg",
  peoples: "/peoples-svg.svg",
  profile: "/profile-svg.svg",
  appLogo: "/icons.svg",
};

const iconFallback = {
  home: "🏠",
  friends: "👥",
  notifications: "🔔",
  posts: "📝",
  search: "🔍",
  peoples: "👫",
  profile: "👤",
  appLogo: "💬",
};

const leftTopItems = ["home", "notifications", "posts", "search", "peoples", "profile"];

const navItems = [{
  icon: "posts",
  label: "Messages",
  actionIcon: "notifications",
  submenu: [
    { label: "Drafts", count: 10 },
    { label: "Scheduled", count: 4 },
    { label: "Published", count: 20 }
  ]
}];

const IconButton = ({ icon }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const fallback = iconFallback[icon] || "❔";

  const handleClick = () => {
    if (icon === "notifications") navigate("/notifications");
    else if (icon === "home") navigate("/home");
    else if (icon === "posts") navigate("/posts");
    else if (icon === "search") navigate("/search");
    else if (icon === "profile") navigate("/profile");
    else if (icon === "peoples") navigate("/peoples");
  };

  return (
    <button className="header icon-button" type="button" onClick={handleClick}>
      {iconAssets[icon] && !imgError ? (
        <img
          src={iconAssets[icon]}
          alt={`${icon} icon`}
          className="icon"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="icon-text">{fallback}</span>
      )}
    </button>
  );
};

const SidebarHeader = () => (
  <div className="header">
    {iconAssets.appLogo ? (
      <img src={iconAssets.appLogo} alt="Vartalaap Logo" className="logo" />
    ) : (
      <div className="logo-placeholder">V</div>
    )}
    <span className="app-name">Vartalaap</span>
  </div>
);

const LeftSidebar = () => (
  <div className="left">
    {leftTopItems.map((icon) => (
      <IconButton key={icon} icon={icon} />
    ))}
  </div>
);

const NavItem = ({ item }) => (
  <>
    <button>
      {iconAssets[item.icon] ? (
        <img
          src={iconAssets[item.icon]}
          alt={`${item.label} icon`}
          className="icon"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <span className="icon-text">{iconFallback[item.icon] || "❔"}</span>
      )}
      <span>{item.label}</span>
      {item.actionIcon &&
        (iconAssets[item.actionIcon] ? (
          <img
            src={iconAssets[item.actionIcon]}
            alt="action icon"
            className="icon"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <span className="icon-text">{iconFallback[item.actionIcon] || "❔"}</span>
        ))}
    </button>
    {item.submenu && <Submenu items={item.submenu} />}
  </>
);

const Navigation = () => (
  <nav>
    {navItems.map((item) => (
      <NavItem key={item.label} item={item} />
    ))}
  </nav>
);

const Submenu = ({ items }) => (
  <ul className="submenu">
    {items.map((subitem) => (
      <li key={subitem.label}>
        {subitem.label}
        <span className="badge">{subitem.count}</span>
      </li>
    ))}
  </ul>
);

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const authorName = post.user?.username ? `@${post.user.username}` : post.author || "@unknown";
  const timeAgo = post.createdAt ? getTimeAgo(post.createdAt) : (post.time || "");

  return (
    <article className="post-card">
      <div className="post-card-header">
        <span
          className="author"
          style={{ cursor: "pointer" }}
          onClick={() => post.user?._id && navigate(`/user/${post.user._id}`)}
        >
          {authorName}
        </span>
        <span className="post-time">{timeAgo}</span>
      </div>
      {post.text && <p>{post.text}</p>}
      {post.img && (
        <img
          src={post.img}
          alt="Post"
          style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "8px" }}
        />
      )}
    </article>
  );
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

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [allRes, followingRes] = await Promise.all([
          fetch("/api/posts/all", { credentials: "include" }),
          fetch("/api/posts/following", { credentials: "include" }),
        ]);

        if (allRes.ok) {
          const allData = await allRes.json();
          setPosts(allData);
        }
        if (followingRes.ok) {
          const followingData = await followingRes.json();
          setFollowingPosts(followingData);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const visibleItems = activeTab === "all" ? posts : followingPosts;

  return (
    <div className="right">
      <div className="right-inner">
        <div className="feed-header">
          <h2>What's Happening</h2>
          <div className="tabs">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Posts
            </button>
            <button
              className={activeTab === "following" ? "active" : ""}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>
        <div className="post-list">
          {loading ? (
            <p style={{ textAlign: "center", color: "#9CA3AF", padding: "2rem" }}>Loading posts...</p>
          ) : visibleItems.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9CA3AF", padding: "2rem" }}>No posts yet.</p>
          ) : (
            visibleItems.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <LeftSidebar />
    </aside>
  );
};

const SuggestedPeople = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch("/api/users/suggested", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setSuggestedUsers(data);
        }
      } catch (err) {
        console.error("Error fetching suggested users:", err);
      }
    };
    fetchSuggested();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setSuggestedUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  if (suggestedUsers.length === 0) return null;

  return (
    <aside className="suggested-sidebar">
      <h3>Suggested People</h3>
      <div className="suggested-list">
        {suggestedUsers.map((user) => (
          <div key={user._id} className="suggested-user">
            <span className="avatar">
              {user.profileImg ? (
                <img src={user.profileImg} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
              ) : "👤"}
            </span>
            <div
              className="user-info"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <span className="name">{user.fullName || user.username}</span>
              <span className="handle">@{user.username}</span>
            </div>
            <button className="follow-btn" onClick={() => handleFollow(user._id)}>Follow</button>
          </div>
        ))}
      </div>
    </aside>
  );
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const DashboardLayout = ({ children, hideSuggested = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        if (!res.ok) throw new Error("Failed to logout");
        return await res.json();
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
  });

  return (
  <div className="app">
    <SpaceBackground />
    <header className="site-header">
      <img
        src="/Vartalaap-svg.svg"
        alt="VartaLaap logo"
        className="site-logo"
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        onClick={() => navigate('/home')}
      />
    </header>
    <button className="about-btn" onClick={() => navigate('/about')}>About</button>
    {authUser ? (
      <button className="auth-btn" onClick={() => logout()}>Logout</button>
    ) : (
      <button className="auth-btn" onClick={() => navigate('/signup')}>Login / Signup</button>
    )}
    <Sidebar />
    <main className={`main-content${hideSuggested ? ' main-content--wide' : ''}`}>
      {children || <RightSidebar />}
    </main>
    {!hideSuggested && <SuggestedPeople />}
  </div>
  );
};

const HomePage = () => {
  return (
    <DashboardLayout />
  );
};

export default HomePage;
