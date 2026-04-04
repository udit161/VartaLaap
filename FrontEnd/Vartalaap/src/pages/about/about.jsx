import React from "react";
import { DashboardLayout } from "../home/HomePage";
import "../home/homepage.css";
import "./about.css";

const AboutPage = () => {
    return (
        <DashboardLayout hideSuggested>
            <div className="right">
                <div className="right-inner about-page-inner">
                    <div className="about-hero">
                        <h1 className="about-title">About Vartalaap</h1>
                        <p className="about-tagline">Connect. Share. Inspire.</p>
                    </div>

                    <div className="about-content">
                        <section className="about-card">
                            <div className="about-card-icon">🚀</div>
                            <h3>Our Mission</h3>
                            <p>
                                Vartalaap is the next-gen hub where students sync up. From debugging complex code and mastering study sessions to sharing the highs and lows of campus life, we provide the space for every voice to be heard. Whether it’s a syntax error or a personal breakthrough, your story belongs here.
                            </p>
                        </section>

                        <section className="about-card">
                            <div className="about-card-icon">✨</div>
                            <h3>Features</h3>
                            <ul className="about-features-list">
                                <li>📝 Share posts with text, images & videos</li>
                                <li>Share your notes, expiernce and many more</li>
                                <li>🔔 Real-time notifications</li>
                                <li>🔍 Powerful search across the platform</li>
                                <li>🎨 Get to know about your what your friend is doing.</li>
                            </ul>
                        </section>

                        <section className="about-card">
                            <div className="about-card-icon">💡</div>
                            <h3>Disclaimer</h3>
                            <div className="about-tech-badges">
                                <p> We are not affiliated with any social media platform.</p>
                            </div>
                        </section>

                        <section className="about-card">
                            <div className="about-card-icon">❤️</div>
                            <h3>Made With Love</h3>
                            <p>
                                Vartalaap is crafted with passion, creativity, and a vision to redefine
                                how people connect online. Thank you for being part of our journey!
                            </p>
                        </section>
                    </div>

                    <div className="about-footer">
                        <p>© 2026 Vartalaap — All rights reserved.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AboutPage;
