'use client';

/* Plugins. */
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { connect } from 'react-redux';

/* Providers. */
import { useThemeContext } from '@/configurations/theme';

/* Components. */
import AdminAuthGate from "@/components/AdminAuthGate/AdminAuthGate";
import AdminNavbar from "@/components/AdminNavbar/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";

/* Helpers. */
import Cookies from 'js-cookie';

const AdminLayout = (props) => {

    /* Props. */
    const { children, userDetails, siteSettingsData } = props;

    /* Theme context */
    const { theme, toggleTheme } = useThemeContext();

    /* Hooks. */
    const router = useRouter();
    const pathname = usePathname();

    /* State. */
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    /* Handle screen resize */
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth > 768;
            setIsDesktop(desktop);
            if (desktop && isSidebarOpen) setIsSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    /* Close sidebar when route changes on mobile */
    useEffect(() => {
        if (!isDesktop && isSidebarOpen) setIsSidebarOpen(false);
    }, [pathname, isDesktop, isSidebarOpen]);

    /* Handle logout */
    const handleLogout = () => {
        Cookies.remove('id_token');
        router.push('/login');
    };

    /* Handle sidebar toggle */
    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <AdminAuthGate>
            <div className="admin-layout-container" >

                {/* Sidebar Component */}
                < AdminSidebar
                    theme={theme}
                    userDetails={userDetails}
                    siteSettingsData={siteSettingsData}
                    onToggleTheme={toggleTheme}
                    onLogout={handleLogout}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={handleToggleSidebar}
                />

                < div className="admin-content-wrapper" >

                    {/* Navbar Component */}
                    < AdminNavbar
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        onToggleSidebar={handleToggleSidebar}
                        userDetails={userDetails}
                    />

                    {/* Main Content Area */}
                    < main className="admin-main-content" >
                        {children}
                    </main>
                </div>

            </div>
        </AdminAuthGate>
    );
};

const mapState = state => ({
    userDetails: state?.userDetails,
    siteSettingsData: state?.siteSettings
});

export default connect(mapState)(AdminLayout);