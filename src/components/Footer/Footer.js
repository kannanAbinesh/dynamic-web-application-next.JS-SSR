"use client";

import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import './footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Main Footer Content */}
            <div className="footer-container">
                <div className="footer-grid">

                    {/* Company Info */}
                    <div className="footer-column footer-about">
                        <div className="footer-logo">
                            <img src="http://35.174.168.216:3005/uploads/siteSettings/e32ceb2051a3587ce8a8e44c279854b4.png" alt="Company Logo" />
                        </div>
                        <p className="footer-description">
                            We are dedicated to providing the best services to our customers.
                            Quality and customer satisfaction are our top priorities.
                        </p>
                        <div className="footer-contact">
                            <div className="footer-contact-item">
                                <Mail size={18} />
                                <span>info@company.com</span>
                            </div>
                            <div className="footer-contact-item">
                                <Phone size={18} />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="footer-contact-item">
                                <MapPin size={18} />
                                <span>123 Business St, City, State 12345</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h3 className="footer-title">Support</h3>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about-us">About us</a></li>
                            <li><a href="/contact-us">Contact Us</a></li>
                            <li><a href="/privacy">Blogs</a></li>
                            <li><a href="/gallery">Gallery</a></li>
                        </ul>
                    </div>

                    {/* Location Map */}
                    <div className="footer-column">
                        <h3 className="footer-title">Our Location</h3>
                        <div className="footer-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98823492346442!3d40.74844097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1707739200000!5m2!1sen!2sus"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    {/* Copyright */}
                    <div className="footer-copyright">
                        <p>© {currentYear} <strong>Your Company</strong>. All rights reserved.</p>
                    </div>

                    {/* Social Media Links */}
                    <div className="footer-social">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}