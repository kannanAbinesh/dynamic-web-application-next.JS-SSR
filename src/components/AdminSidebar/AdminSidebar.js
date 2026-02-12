'use client';

/* Plugins. */
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

/* Helpers. */
import { adminSideBarData } from '@/helpers/adminSidebar';
import logoImage from '../../askLogo.jpg';

/* Styles. */
import './adminSidebar.css';

const AdminSidebar = (props) => {

    /* Props. */
    const {
        userDetails = { name: 'Admin User', _id: '1' },
        siteSettings = {},
        theme = 'light',
        onToggleTheme,
        onLogout,
        isSidebarOpen = false,
        onToggleSidebar
    } = props;

    /* State. */
    const [isDesktop, setIsDesktop] = useState(true);
    const [logoLoaded, setLogoLoaded] = useState(false);

    /* Hooks. */
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth > 768;
            setIsDesktop(desktop);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isFocusedPath = (path) => pathname === path;

    const siteLogo = siteSettings?.data?.[theme === 'dark' ? 'darkThemeLogo' : 'logo']?.value
        ? `/uploads/siteSettings/${siteSettings?.data[theme === 'dark' ? 'darkThemeLogo' : 'logo']?.value}`
        : null;

    const siteName = siteSettings?.data?.siteName?.value || 'Admin Portal';

    const handleNavigate = (path) => {
        router.push(path);
        if (!isDesktop && onToggleSidebar) onToggleSidebar();
    };

    const handleLogout = () => {
        if (onLogout) onLogout();
    };

    const handleThemeToggle = () => {
        if (onToggleTheme) onToggleTheme();
    };

    const renderSidebarContent = () => {
        return (
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <div
                        className="sidebar-header-link"
                        onClick={() => handleNavigate('/siteadmin/sitesettings')}
                    >
                        <div className="sidebar-logo-wrapper">
                            <Image
                                src={siteLogo || logoImage}
                                alt="Site Logo"
                                className="sidebar-logo"
                                width={160}
                                height={70}
                                onLoad={() => setLogoLoaded(true)}
                                onError={() => setLogoLoaded(false)}
                                style={{
                                    opacity: logoLoaded ? 1 : 0,
                                    transition: 'opacity 0.5s ease-in-out'
                                }}
                                priority
                            />
                        </div>
                    </div>

                    <div className="sidebar-welcome-wrapper">
                        <span className="sidebar-welcome-text">Welcome admin</span>
                    </div>
                </div>

                <div className="sidebar-body">
                    <nav className="sidebar-nav">
                        {adminSideBarData?.map((item, index) => (
                            <div
                                key={index}
                                className={`sidebar-nav-item ${isFocusedPath(item?.path) ? 'sidebar-nav-item-active' : ''}`}
                                onClick={() => handleNavigate(item?.path)}
                            >
                                <div className="sidebar-nav-icon">{item?.icon}</div>
                                <span className="sidebar-nav-text">{item?.name}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="sidebar-actions">
                        <div
                            className="sidebar-nav-item"
                            onClick={handleThemeToggle}
                        >
                            <div className="sidebar-nav-icon">
                                {theme === 'light' ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="sidebar-nav-text">
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>

                        {userDetails?._id && (
                            <div
                                className="sidebar-nav-item"
                                onClick={handleLogout}
                            >
                                <div className="sidebar-nav-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                        />
                                    </svg>
                                </div>
                                <span className="sidebar-nav-text">Logout</span>
                            </div>
                        )}
                    </div>
                </div>

                {isDesktop && (
                    <div className="sidebar-footer">
                        <p className="sidebar-footer-text">
                            <strong>© {new Date().getFullYear()}</strong>{' '}
                            {siteSettings?.data?.poweredBy?.value || 'Admin Portal'}
                        </p>
                        <p className="sidebar-footer-subtext">All rights reserved</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {isDesktop ? (
                renderSidebarContent()
            ) : (
                <>
                    <button
                        className="sidebar-mobile-toggle"
                        onClick={onToggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            width={24}
                            height={24}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    {isSidebarOpen && (
                        <div
                            className="sidebar-overlay"
                            onClick={onToggleSidebar}
                        ></div>
                    )}

                    <div
                        className={`sidebar-mobile ${isSidebarOpen ? 'sidebar-mobile-open' : ''}`}
                    >
                        <button
                            className="sidebar-mobile-close"
                            onClick={onToggleSidebar}
                            aria-label="Close Sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                width={24}
                                height={24}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {renderSidebarContent()}
                    </div>
                </>
            )}
        </>
    );
};

export default AdminSidebar;