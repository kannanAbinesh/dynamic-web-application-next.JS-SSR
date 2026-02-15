"use client";

/* Plugins */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Loader from "../Loader/Loader";

/* Action */
import { userDetails } from "@/actions/userDetails";

export default function AdminAuthGate(props) {

    const { children } = props;

    /* Hooks. */
    const router = useRouter();
    const dispatch = useDispatch();

    /* State declarations. */
    const [checking, setChecking] = useState(true);

    /* Loggedin user details. */
    const { loading, data, error } = useSelector((state) => state.userDetails);

    /* Verify the login users token is valid or not. */
    useEffect(() => { dispatch(userDetails()) }, [dispatch]);

    useEffect(() => {
        if (data) setChecking(false);
        if (error) router.replace("/siteadmin/login");
    }, [data, error, router]);

    if (checking || loading) return <Loader />;
    return children;
}