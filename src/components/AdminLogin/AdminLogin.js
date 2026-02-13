"use client";

/* Plugins. */
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

/* Styles. */
import './adminLogin.css';

const AdminLogin = () => {

    /*Local state declarations. */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

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
        <div className='admin-login-container'>

            {/* Login form. */}
            <div className='admin-login-form-container'>
                <div className='admin-login-form-grid'>

                    <div className="admin-login-form-header-container">
                        <h4>Welcome</h4>
                        <p className='admin-login-form-header-text'>Enter your email and password to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">

                        <div className="admin-input-container">
                            <User className="admin-login-input-icon" />
                            <input
                                type="text"
                                className="admin-login-input"
                                placeholder="Email or Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-input-container">
                            <Lock className="admin-login-input-icon" />
                            <input
                                type={show ? 'text' : 'password'}
                                className="admin-login-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {!show ? <FaEyeSlash className="admin-login-password-field-icon" onClick={() => setShow(!show)} /> : <FaEye className="admin-login-password-field-icon" onClick={() => setShow(!show)} />}
                        </div>

                        <button type="submit" className="admin-login-submit-btn">Sign In →</button>
                    </form>
                </div>
            </div>

            {/* Login banner. */}
            <div className='admin-login-banner-container'>
                <div className='admin-login-banner' />
            </div>
        </div>
    );
};

export default AdminLogin;