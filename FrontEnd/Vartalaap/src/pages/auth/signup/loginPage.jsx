import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { SpaceBackground } from '../../../components/SpaceBackground';
import './loginpage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(text || 'Server error occurred');
            }

            if (!res.ok) {
                throw new Error(data?.error || 'Login failed');
            }

            const userData = { ...data };
            delete userData.message;
            queryClient.setQueryData(["authUser"], userData);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            background: '#0B0F19' // Fallback behind space bg
        }}>
            <SpaceBackground />

            <header className="site-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <img
                    src="/Vartalaap-svg.svg"
                    alt="VartaLaap logo"
                    className="site-logo"
                    style={{ width: '106px', height: '106px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />
            </header>

            <div className="login-card" style={{ marginTop: '80px' }}>
                <div style={{ marginBottom: '35px' }}>
                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '18px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '8px' }}>
                        Welcome Back...
                    </h3>
                    <h1 style={{ fontFamily: '"Bogam", sans-serif', color: '#ff1f1f', fontSize: '48px', fontWeight: '900', lineHeight: '1', margin: '0', textShadow: '0 0 30px rgba(255,31,31,0.5)' }}>
                        Vartalaap
                    </h1>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 31, 31, 0.15)',
                        border: '1px solid rgba(255, 31, 31, 0.4)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        color: '#ff6b6b',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form style={{ width: '100%' }} onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="signup-link" onClick={() => navigate('/signup')}>
                        New to Vartalaap? <span>Sign Up</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;