"use client";

/* Plugins. */
import { useSelector } from "react-redux";

/* Components. */
import SiteSettings from "@/components/SiteSettings/SiteSettings";
import Loader from "@/components/Loader/Loader";

export default function SiteSettingsIndex() {
    const { data, loading } = useSelector((state) => state?.siteSettings);
    return loading ? (<Loader />) : (<SiteSettings formData={data} />);
};