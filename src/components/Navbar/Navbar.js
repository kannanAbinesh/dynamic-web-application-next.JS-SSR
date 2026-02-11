"use client";

/* Plugins */
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TextAlignJustify, Sun, Moon, X } from 'lucide-react';

/* Logo */
import logoImage from '../../askLogo.jpg';

/* Styles */
import './navbar.css';

export default function Navbar() {

    /* State declarations */
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Hooks declarations. */
    const pathname = usePathname();

    /* Handle scroll effect for sticky navbar */
    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 50) };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Apply theme to document */
    useEffect(() => { document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light') }, [isDarkTheme]);

    /* Prevent body scroll when mobile menu is open */
    useEffect(() => { document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset' }, [isMobileMenuOpen]);

    /* Route variables. */
    const navItems = [
        { name: "Home", route: "/" },
        { name: "About us", route: "/about-us" },
        { name: "Blogs", route: "/blogs" },
        { name: "Contact us", route: "/contact-us" }
    ];

    return (
        <div>
            {/* Main Navbar */}
            <nav className={`navbar ${isScrolled ? "scrolled-navbar" : "non-scrolled-navbar"}`}>
                <div className="navbar-container">

                    <Link href="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="navbar-logo-image-container">
                            <Image
                                src={logoImage}
                                className='navbar-logo-image'
                                alt="logo"
                                width={50}
                                height={50}
                                priority
                            />
                        </div>
                    </Link>

                    <ul className="navbar-links-container navbar-desktop-only">
                        {navItems.map((element, index) => (
                            <li key={index}>
                                <Link
                                    href={element.route}
                                    className={pathname === element.route ? 'navbar-link navbar-link-active' : 'navbar-link'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >{element.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Theme Toggle */}
                    <div className="navbar-theme-controller navbar-desktop-only">
                        <button className="navbar-theme-toggle-circle" onClick={() => setIsDarkTheme(!isDarkTheme)} aria-label="Toggle theme">
                            {isDarkTheme ? (<Sun size={20} className="navbar-theme-single-icon" />) : (<Moon size={20} className="navbar-theme-single-icon" />)}
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`navbar-mobile-toggle navbar-mobile-only ${isMobileMenuOpen ? 'navbar-mobile-toggle-active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <TextAlignJustify size={27} />
                    </button>
                </div>
            </nav>

            {/* Spacer to prevent content jump when navbar becomes fixed */}
            {isScrolled && <div style={{ height: '80px' }} />}

            {/* Mobile Sidebar */}
            <div className={`navbar-mobile-sidebar ${isMobileMenuOpen ? 'navbar-mobile-sidebar-active' : ''}`}>

                {/* Sidebar Header. */}
                <div className="navbar-sidebar-header">
                    <div className="navbar-sidebar-logo">
                        <div className="navbar-sidebar-logo-image">
                            <Image src={logoImage} alt="Logo" width={45} height={45} />
                        </div>
                    </div>
                    <button className="navbar-sidebar-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                {/* Sidebar Links */}
                <ul className="navbar-sidebar-links">
                    {navItems.map((element, index) => (
                        <li key={index}>
                            <Link
                                href={element.route}
                                className={pathname === element.route ? 'navbar-sidebar-link navbar-sidebar-link-active' : 'navbar-sidebar-link'}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {element.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Sidebar Theme Section */}
                <div className="navbar-sidebar-theme">
                    <button className={`navbar-sidebar-theme-option ${!isDarkTheme ? 'navbar-sidebar-theme-option-active' : ''}`} onClick={() => setIsDarkTheme(false)}>
                        <Sun size={20} />
                        <span>Light mode</span>
                    </button>
                    <button className={`navbar-sidebar-theme-option ${isDarkTheme ? 'navbar-sidebar-theme-option-active' : ''}`} onClick={() => setIsDarkTheme(true)} >
                        <Moon size={20} />
                        <span>Dark mode</span>
                    </button>
                </div>
            </div>
        </div>
    );
};