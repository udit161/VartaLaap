import React from "react";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import SignInPage from "./pages/auth/signup/SignInPage";
import LoginPage from "./pages/auth/signup/loginPage";
import NotificationPage from "./pages/notificationPages/NottficationPage";
import PostPage from "./pages/posts/post";
import SearchPage from "./pages/search/search";
import YourProfile from "./pages/profile/yourProfile";
import OtherProfile from "./pages/profile/otherProfile";
import PeoplesPage from "./pages/peoples/peoples";
import AboutPage from "./pages/about/about";

const App = () => {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                if (!res.ok) {
                    if (res.status === 401) return null;
                    throw new Error("Failed to authenticate");
                }
                const data = await res.json();
                return data;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center" style={{ background: '#0B0F19', color: 'white' }}>
                <p>Loading Space...</p>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen'>
            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path='/signin' element={!authUser ? <SignInPage /> : <Navigate to="/" />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path='/home' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
                <Route path='/posts' element={authUser ? <PostPage /> : <Navigate to="/login" />} />
                <Route path='/search' element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
                <Route path='/profile' element={authUser ? <YourProfile /> : <Navigate to="/login" />} />
                <Route path='/user/:userId' element={authUser ? <OtherProfile /> : <Navigate to="/login" />} />
                <Route path='/peoples' element={authUser ? <PeoplesPage /> : <Navigate to="/login" />} />
                <Route path='/about' element={<AboutPage />} />
            </Routes>
        </div>
    );
};

export default App;
