"use client";

/* Plugins. */
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";

/* Helpers. */
import Store, { fetchSiteSettings } from '@/reducers';

/* Functionality to get the site settings data. */
function AppInitializer({ children }) {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(fetchSiteSettings()) }, [dispatch]);
    return children;
};

/* Component where the store is intialized to the application. */
export function Providers({ children }) {
    return (
        <Provider store={Store}>
            <AppInitializer>
                {children}
            </AppInitializer>
        </Provider>
    );
};