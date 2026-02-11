"use client";

/* Style. */
import './loader.css';

export default function Loader() {

    return (
        <div className="loader-wrapper">

            {/* Three dots loader DOM. */}
            <div className="loader-dots">
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
            </div>
        </div>
    );
}