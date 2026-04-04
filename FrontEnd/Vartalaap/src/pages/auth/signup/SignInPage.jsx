import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '../../../components/SpaceBackground';
import { useQueryClient } from '@tanstack/react-query';
import './signinpage.css';

const SignInPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // State variables for the fields
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: userName,
                    fullName,
                    email,
                    password,
                }),
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
                throw new Error(data?.error || 'Registration failed');
            }

            queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
            
            <header className="site-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', marginTop: '10px', zIndex: 100 }}>
                <img
                    src="/Vartalaap-svg.svg"
                    alt="VartaLaap logo"
                    className="site-logo"
                    style={{ width: '106px', height: '106px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />
            </header>

            <div className="signin-card">
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={{ fontFamily: '"Bogam", sans-serif', color: '#ff1f1f', fontSize: '36px', fontWeight: '900', margin: '0', textShadow: '0 0 20px rgba(255,31,31,0.5)' }}>
                        Create Your Account
                    </h1>
                    <p style={{ color: '#9ca3af', marginTop: '10px' }}>Join the Vartalaap community today.</p>
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

                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    
                    <div className="input-row">
                        <div className="input-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                className="signin-input" 
                                placeholder="@username" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                className="signin-input" 
                                placeholder="Full Name" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                className="signin-input" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                className="signin-input" 
                                placeholder="Min 6 characters" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                className="signin-input" 
                                placeholder="Re-enter password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-btn" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '16px', color: '#9ca3af', fontSize: '14px', cursor: 'pointer' }}
                         onClick={() => navigate('/login')}>
                        Already have an account? <span style={{ color: '#ff1f1f', fontWeight: 'bold' }}>Login</span>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
