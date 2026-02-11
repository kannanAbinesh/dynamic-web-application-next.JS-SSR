/* Plugins. */
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function NotFound() {
    return (
        <div>
            <Navbar />
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="error-title">Uh-oh!</h1>

                    <p className="error-description">
                        We can't seem to find the page you're looking for!
                    </p>

                    <p className="error-code">Error code: 404</p>

                    <div className="suggestions">
                        <p className="suggestions-title">Here are some helpful links instead:</p>
                        <ul className="suggestions-list">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about-us">About us</a></li>
                            <li><a href="/contact-us">Contact us</a></li>
                            <li><a href="/blogs">Blogs</a></li>
                            <li><a href="/gallery">Gallery</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};