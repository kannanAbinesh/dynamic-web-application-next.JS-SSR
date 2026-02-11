"use client";

/* Plugins. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

/* Components. */
import Loader from "../Loader/Loader";

export default function AdminAuthGate(props) {

    /* Props. */
    const { children } = props;

    /* State. */
    const [checking, setChecking] = useState(true);

    /* Hooks declarations. */
    const router = useRouter();

    useEffect(() => {
        async function verify() {
            try {
                const response = await fetch("/api/auth/tokenVerification", { method: "GET" });
                if (!response.ok) {
                    router.replace("/siteadmin/login");
                    return;
                };
            } catch (error) {
                showToast.error(error, { duration: 4000, progress: true, position: "bottom-center", transition: "bounceIn" });
                return "";
            } finally { setChecking(false) };
        };
        verify();
    }, [router]);

    if (checking) return (<Loader />); /* Loader. */
    return children; /* Childern routes. */
};
