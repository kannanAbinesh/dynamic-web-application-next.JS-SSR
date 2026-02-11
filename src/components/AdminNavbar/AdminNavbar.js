'use client';

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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="admin-navbar-breadcrumb">
                        <span className="admin-navbar-breadcrumb-text">Admin Panel</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}