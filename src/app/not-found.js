/* Plugins. */
import Link from "next/link";

/* Components. */
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function NotFound() {

    /* Variables. */
    const notFoundData = [
        { id: 1, name: "Home", route: "/" },
        { id: 2, name: "About us", route: "/" },
        { id: 3, name: "Contact us", route: "/" },
        { id: 4, name: "Gallery", route: "/" },
        { id: 5, name: "Blogs", route: "/" }
    ];

    return (
        <div>
            <Navbar />
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="not-found-error-title">Uh-oh!</h1>
                    <p className="not-found-error-description">We can't seem to find the page you're looking for!</p>
                    <p className="not-found-error-code">Error code: 404</p>

                    <div className="not-found-suggestions">
                        <p className="not-found-suggestions-title">Here are some helpful links instead:</p>
                        <ul className="not-found-suggestions-list">
                            {notFoundData?.map((ele, index) => (
                                <li className="not-found-suggestions-item" key={index}>
                                    <Link href={ele?.route} className="not-found-suggestions-link">{ele?.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};