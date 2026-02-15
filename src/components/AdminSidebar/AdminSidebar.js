'use client';

/* Plugins. */
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdLightMode, MdDarkMode, MdLogout, MdMenu, MdClose } from 'react-icons/md';
import { connect } from 'react-redux';

/* Helpers. */
import { adminSideBarData } from '@/helpers/adminSidebar';

/* Styles. */
import './adminSidebar.css';

const AdminSidebar = (props) => {

    /* Props. */
    const { userDetails, siteSettingsData, theme = 'light', onToggleTheme, onLogout, isSidebarOpen = false, onToggleSidebar } = props;

    /* State. */
    const [isDesktop, setIsDesktop] = useState(true);
    const [logoLoaded, setLogoLoaded] = useState(false);

    /* Hooks. */
    const pathname = usePathname();
    const router = useRouter();

    /* To get the screen resolution to find the device in which the application is running. */
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth > 768;
            setIsDesktop(desktop);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* Check if path is focused */
    const isFocusedPath = (path) => pathname === path;

    /* Get site settings data */
    const settingsData = siteSettingsData?.data || {};

    // Determine which logo to show based on theme
    const currentLogo = theme === 'dark' ? settingsData.darkThemeLogo : settingsData.logo;
    const siteLogo = currentLogo ? `/uploads/siteSettings/${currentLogo}` : null;
    const siteName = settingsData.siteName || 'Admin Portal';
    const poweredBy = settingsData.poweredBy || 'Admin Portal';

    /* Handle navigation */
    const handleNavigate = (path) => {
        router.push(path);
        if (!isDesktop && onToggleSidebar) onToggleSidebar();
    };

    /* Handle logout */
    const handleLogout = () => {
        if (onLogout) onLogout();
    };

    /* Handle theme toggle */
    const handleThemeToggle = () => {
        if (onToggleTheme) onToggleTheme();
    };

    /* Render sidebar content */
    const renderSidebarContent = () => {
        return (
            <div className="admin-sidebar-container">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-header-link">
                        <div className="admin-sidebar-logo-wrapper">
                            {siteLogo ? (
                                <Image
                                    src={siteLogo}
                                    alt="Site Logo"
                                    className="admin-sidebar-logo"
                                    onClick={() => handleNavigate('/siteadmin/sitesettings')}
                                    width={160}
                                    height={70}
                                    onLoad={() => setLogoLoaded(true)}
                                    onError={() => setLogoLoaded(false)}
                                    style={{
                                        opacity: logoLoaded ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out',
                                        display: logoLoaded ? 'block' : 'none'
                                    }}
                                    priority
                                />
                            ) : null}

                            {(!siteLogo || !logoLoaded) && (
                                <h2
                                    className="admin-sidebar-site-name"
                                    onClick={() => handleNavigate('/siteadmin/sitesettings')}
                                >
                                    {siteName}
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="admin-sidebar-welcome-wrapper">
                        <span className="admin-sidebar-welcome-text">Welcome admin</span>
                    </div>
                </div>

                <div className="admin-sidebar-body">
                    <nav className="admin-sidebar-nav">
                        {adminSideBarData?.map((item, index) => (
                            <div
                                key={index}
                                className={`admin-sidebar-nav-item ${isFocusedPath(item?.path) ? 'admin-sidebar-nav-item-active' : ''}`}
                                onClick={() => handleNavigate(item?.path)}
                            >
                                <div className="admin-sidebar-nav-icon">{item?.icon}</div>
                                <span className="admin-sidebar-nav-text">{item?.name}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="admin-sidebar-actions">
                        <div
                            className="admin-sidebar-nav-item"
                            onClick={handleThemeToggle}
                        >
                            <div className="admin-sidebar-nav-icon">
                                {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
                            </div>
                            <span className="admin-sidebar-nav-text">
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>

                        {userDetails?._id && (
                            <div
                                className="admin-sidebar-nav-item"
                                onClick={handleLogout}
                            >
                                <div className="admin-sidebar-nav-icon">
                                    <MdLogout />
                                </div>
                                <span className="admin-sidebar-nav-text">Logout</span>
                            </div>
                        )}
                    </div>
                </div>

                {isDesktop && (
                    <div className="admin-sidebar-footer">
                        <p className="admin-sidebar-footer-text">
                            <strong>© {new Date().getFullYear()}</strong>{' '}
                            {poweredBy}
                        </p>
                        <p className="admin-sidebar-footer-subtext">All rights reserved</p>
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
                        className="admin-sidebar-mobile-toggle"
                        onClick={onToggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <MdMenu size={24} />
                    </button>

                    {isSidebarOpen && (
                        <div
                            className="admin-sidebar-overlay"
                            onClick={onToggleSidebar}
                        ></div>
                    )}

                    <div
                        className={`admin-sidebar-mobile ${isSidebarOpen ? 'admin-sidebar-mobile-open' : ''}`}
                    >
                        <button
                            className="admin-sidebar-mobile-close"
                            onClick={onToggleSidebar}
                            aria-label="Close Sidebar"
                        >
                            <MdClose size={24} />
                        </button>
                        {renderSidebarContent()}
                    </div>
                </>
            )}
        </>
    );
};

const mapState = state => ({
    siteSettingsData: state?.siteSettings,
    userDetails: state?.userDetails?.data
});

export default connect(mapState)(AdminSidebar);