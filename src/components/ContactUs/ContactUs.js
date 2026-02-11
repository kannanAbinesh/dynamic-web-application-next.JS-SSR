"use client";
import Link from 'next/link';
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';
import './contact.css';

const ContactUs = () => {
    return (
        <div className="contact-page">
            {/* Hero Section with Images and Text */}
            <section className="contact-hero-section">
                <div className="contact-hero-container">
                    {/* Left Side - Images and Text */}
                    <div className="contact-hero-left">
                        <div className="hero-images">
                            <div className="hero-image-item square">
                                <img src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=400&fit=crop" alt="Arctic Fox" />
                            </div>
                            <div className="hero-image-item circle">
                                <img src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop" alt="White Fox" />
                            </div>
                            <div className="hero-image-item triangle">
                                <img src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=400&fit=crop" alt="Mountain Church" />
                            </div>
                        </div>
                        <div className="hero-text-content">
                            <h1 className="hero-main-title">
                                Have an idea?<br />
                                Let's collaborate
                            </h1>
                            <p className="hero-description">
                                We're open to new opportunities and ready to take on your next project.
                                Whether you already have a clear vision or simply need professional guidance,
                                our team is here to help.
                            </p>
                            <p className="hero-cta-text">
                                Feel free to reach out via email or give us a call — we'd love to collaborate with you!
                            </p>

                            <div className="hero-contact-info">
                                <h3 className="contact-info-title">LET'S CONNECT</h3>
                                <div className="contact-info-grid">
                                    <div className="contact-info-column">
                                        <div className="contact-info-item">
                                            <Phone size={18} className="contact-icon" />
                                            <p className="contact-phone-number">+1 628-234-6708</p>
                                        </div>
                                        <div className="contact-info-item">
                                            <Mail size={18} className="contact-icon" />
                                            <p className="contact-email-address">hello@foks.com.us</p>
                                        </div>
                                        <div className="contact-info-item">
                                            <MapPin size={18} className="contact-icon" />
                                            <p className="contact-address">
                                                San Francisco, CA,<br />
                                                USA
                                            </p>
                                        </div>
                                    </div>
                                    <div className="contact-info-column">
                                        <p className="contact-hours">Monday- Friday: 8:00am-9:30pm</p>
                                        <p className="contact-hours">Saturday: 8:00am-4:30pm</p>
                                        <p className="contact-hours">Sunday: Closed</p>
                                    </div>
                                </div>

                                {/* Social Media Icons */}
                                <div className="social-media-section">
                                    <div className="social-icons">
                                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                                            <Facebook size={20} />
                                        </Link>
                                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                                            <Twitter size={20} />
                                        </Link>
                                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                                            <Instagram size={20} />
                                        </Link>
                                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                                            <Linkedin size={20} />
                                        </Link>
                                        <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                                            <Youtube size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="contact-hero-right">
                        <div className="contact-form-card">
                            <h2 className="form-card-title">GET IN TOUCH</h2>

                            <form className="contact-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Your name *"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Email address *"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Your message...."
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" className="form-checkbox" required />
                                        <span className="checkbox-text">
                                            I have read and agree to the <Link href="/terms" className="terms-link">terms</Link>
                                        </span>
                                    </label>
                                </div>

                                <button type="submit" className="submit-button">
                                    <span>Send message</span>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;