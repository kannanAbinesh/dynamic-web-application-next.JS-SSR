'use client';

/* Plugins. */
import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';

/* Variables. */
const THEME_COOKIE_NAME = 'app_theme';

export const useTheme = () => {

    /* State declarations. */
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedTheme = Cookies.get(THEME_COOKIE_NAME) || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        setIsLoading(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        Cookies.set(THEME_COOKIE_NAME, newTheme, { expires: 365 }); // Expires in 1 year
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const setSpecificTheme = (newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') return;
        setTheme(newTheme);
        Cookies.set(THEME_COOKIE_NAME, newTheme, { expires: 365 });
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return { theme, isLoading, toggleTheme, setTheme: setSpecificTheme };
};

const ThemeContext = createContext({ theme: 'light', isLoading: true, toggleTheme: () => { }, setTheme: () => { } });

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
    return context;
};

export const ThemeProvider = ({ children }) => {
    const themeData = useTheme();
    return (<ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>);
};