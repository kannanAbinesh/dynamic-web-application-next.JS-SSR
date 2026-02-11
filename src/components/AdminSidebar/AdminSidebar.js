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
    const { userDetails = { name: 'Admin User', _id: '1' }, siteSettings = {}, theme = 'light', onToggleTheme, onLogout, isSidebarOpen = false, onToggleSidebar } = props;

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

    const siteLogo = siteSettings?.data?.[theme === 'dark' ? 'darkThemeLogo' : 'logo']?.value ? `/uploads/siteSettings/${siteSettings?.data[theme === 'dark' ? 'darkThemeLogo' : 'logo']?.value}` : null;
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
            <div className='sidebar-container'>
                <div className='sidebar-header'>
                    <div
                        className='sidebar-header-link'
                        onClick={() => handleNavigate('/siteadmin/sitesettings')}
                    >
                        {/* {siteLogo ? ( */}
                        <div className='sidebar-logo-wrapper'>
                            <Image
                                className='sidebar-logo'
                                src={logoImage}
                                alt='logo'
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
                        {/* ) : (
                            <span className='sidebar-site-name'>{siteName}</span>
                        )} */}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span className='sidebar-welcome-text'>Welcome admin</span>
                    </div>
                </div>

                <div className='sidebar-body'>
                    <nav className='sidebar-nav'>
                        {adminSideBarData?.map((item, index) => (
                            <div
                                key={index}
                                className={`sidebar-nav-item ${isFocusedPath(item?.path) ? 'sidebar-nav-item-active' : ''}`}
                                onClick={() => handleNavigate(item?.path)}
                            >
                                <div className='sidebar-nav-icon'>
                                    {item?.icon}
                                </div>
                                <span className='sidebar-nav-text'>{item?.name}</span>
                                {isFocusedPath(item?.path) && (
                                    <div className='sidebar-nav-indicator'></div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className='sidebar-actions'>
                        <div className='sidebar-nav-item' onClick={handleThemeToggle}>
                            <div className='sidebar-nav-icon'>
                                {theme === 'light' ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                ) : (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                )}
                            </div>
                            <span className='sidebar-nav-text'>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>

                        {userDetails?._id && (
                            <div className='sidebar-nav-item' onClick={handleLogout}>
                                <div className='sidebar-nav-icon'>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </div>
                                <span className='sidebar-nav-text'>Logout</span>
                            </div>
                        )}
                    </div>
                </div>

                {isDesktop && (
                    <div className='sidebar-footer'>
                        <span className='sidebar-footer-text'>
                            © {new Date().getFullYear()} <strong>{siteSettings?.data?.poweredBy?.value || 'Admin Portal'}</strong>
                        </span>
                        <span className='sidebar-footer-subtext'>All rights reserved</span>
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
                    {isSidebarOpen && (
                        <div
                            className='sidebar-overlay'
                            onClick={onToggleSidebar}
                        />
                    )}

                    <div className={`sidebar-mobile ${isSidebarOpen ? 'sidebar-mobile-open' : ''}`}>
                        <div className='sidebar-mobile-close' onClick={onToggleSidebar}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        {renderSidebarContent()}
                    </div>
                </>
            )}
        </>
    );
};

export default AdminSidebar;