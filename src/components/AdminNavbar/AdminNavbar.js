'use client';
// import { RiMenu4Line } from "react-icons/ri";

import { useState } from 'react';
import './adminNavbar.css';

export default function AdminNavbar({ theme, onToggleTheme, onToggleSidebar }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications] = useState(3);

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-container">
                {/* Left Section - Mobile Menu Toggle */}
                <div className="admin-navbar-left">
                    <button
                        className="admin-navbar-menu-btn"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        {/* <RiMenu4Line /> */}
                    </button>

                    <div className="admin-navbar-breadcrumb">
                        <span className="admin-navbar-breadcrumb-text">Admin Panel</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}