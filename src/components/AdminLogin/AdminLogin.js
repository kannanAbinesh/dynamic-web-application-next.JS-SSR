"use client";

/* Plugins. */
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import { useRouter } from 'next/navigation';

/* Styles. */
import './adminLogin.css';

const AdminLogin = () => {

    /*Local state declarations. */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /* Hooks declarations. */
    const router = useRouter();

    /* Submit functionality. */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const { status } = response;

            /* If the login is successfull. */
            if (status === 200) {
                router.push("/siteadmin/dashboard");
                return "";
            };

        } catch (error) {
            showToast.error(error, { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
            return "";
        };
    };

    return (
        <div className="login-page">

            <div className="login-left-section">

                <div className="login-form-container">
                    <div className="login-header">
                        <h1 className="login-title">Welcome</h1>
                        <p className="login-subtitle">Enter your email and password to sign in</p>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Email or Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-submit-btn">Sign In →</button>
                    </form>
                </div>
            </div>

            <div className="login-right-section">
                <img src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&h=1600&fit=crop" alt="Mountain church scenery" className="login-bg-image" />
            </div>
        </div>
    );
};

export default AdminLogin;