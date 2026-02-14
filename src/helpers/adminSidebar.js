/* Plugins. */
import { MdFeaturedPlayList } from "react-icons/md";
import { SiAboutdotme } from "react-icons/si";
import { FaPhone, FaBlog } from "react-icons/fa6";
import { FiHome, FiSettings } from "react-icons/fi";
import { LuGalleryHorizontalEnd } from "react-icons/lu";

export const adminSideBarData = [
    { id: 1, name: "Site settings", path: "/siteadmin/sitesettings", icon: (<FiSettings size={25} />) },
    { id: 2, name: "Manage Home", path: "/siteadmin/manage-home", icon: (<FiHome size={25} />) },
    { id: 3, name: "Manage About Us", path: "/siteadmin/manage-about-us", icon: (<SiAboutdotme size={25} />) },
    { id: 4, name: "Manage Blogs", path: "/siteadmin/manage-blogs", icon: (<FaBlog size={25} />) },
    { id: 5, name: "Manage Contact Us", path: "/siteadmin/manage-contact-us", icon: (<FaPhone size={25} />) },
    { id: 6, name: "Manage Gallery", path: "/siteadmin/manage-gallery", icon: (<LuGalleryHorizontalEnd size={25} />) },
    { id: 7, name: "Queries", path: "/siteadmin/queries", icon: (<MdFeaturedPlayList size={25} />) }
];