/* Plugins. */
import { MdFeaturedPlayList } from "react-icons/md";
import { SiAboutdotme } from "react-icons/si";
import { FaPhone, FaBlog } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { FiHome } from "react-icons/fi";

export const adminSideBarData = [
    { id: 1, name: "Site settings", path: "/siteadmin/sitesettings", icon: (<FiSettings size={25} />) },
    { id: 2, name: "Manage home", path: "/siteadmin/manage-home", icon: (<FiHome size={25} />) },
    { id: 3, name: "Manage About us", path: "/siteadmin/manage-about-us", icon: (<SiAboutdotme size={25} />) },
    { id: 4, name: "Manage Blogs", path: "/siteadmin/manage-blogs", icon: (<FaBlog size={25} />) },
    { id: 5, name: "Manage Contact us", path: "/siteadmin/manage-contact-us", icon: (<FaPhone size={25} />) },
    { id: 6, name: "Queries", path: "/siteadmin/queries", icon: (<MdFeaturedPlayList size={25} />) }
];