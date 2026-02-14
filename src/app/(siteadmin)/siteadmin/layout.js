'use client';

/* Plugins. */
import { useState, useEffect } from 'react';

/* Components. */
import AdminAuthGate from "@/components/AdminAuthGate/AdminAuthGate";
import AdminNavbar from "@/components/AdminNavbar/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";

export default function layout(props) {

    /* Props. */
    const { children } = props;

    /* State. */
    const [theme, setTheme] = useState('light');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /* Theme. */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const handleToggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
    };

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <AdminAuthGate>
            <div className="admin-layout-container" data-theme={theme}>
                <AdminSidebar
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    onLogout={handleLogout}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={handleToggleSidebar}
                />

                <div className="admin-content-wrapper">
                    <AdminNavbar theme={theme} onToggleTheme={handleToggleTheme} onToggleSidebar={handleToggleSidebar} />
                    <main className="admin-main-content">
                        {children}
                    </main>
                </div>
            </div>
        </AdminAuthGate>
    );
}