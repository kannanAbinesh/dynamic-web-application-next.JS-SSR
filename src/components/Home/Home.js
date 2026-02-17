"use client";

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import './home.css';

export default function Home({ formData = {} }) {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    /* ── Extract data ── */
    const get = (key, fallback) => formData?.[key]?.value ?? fallback;

    const heroImages = get('heroImages', []);
    const heroTitle = get('heroTitle', 'Luxury Redefined');
    const heroSubtitle = get('heroSubtitle', 'Experience unparalleled elegance and comfort');

    const welcomeImages = get('welcomeImages', []);
    const welcomeTag = get('welcomeTag', 'Welcome To Our Hotel');
    const welcomeTitle = get('welcomeTitle', 'Experience the finest luxury hospitality');
    const welcomeDescription = get('welcomeDescription', '');

    const featuresTag = get('featuresTag', 'Our Excellence');
    const featuresTitle = get('featuresTitle', 'Why Choose Us');
    const featuresSubtitle = get('featuresSubtitle', '');
    const features = get('features', []);

    const roomsTag = get('roomsTag', 'Accommodations');
    const roomsTitle = get('roomsTitle', 'Our Signature Suites');
    const roomsSubtitle = get('roomsSubtitle', '');
    const rooms = get('rooms', []);

    const testimonialsTag = get('testimonialsTag', 'Guest Reviews');
    const testimonialsTitle = get('testimonialsTitle', 'What Our Guests Say');
    const testimonials = get('testimonials', []);

    const ctaTitle = get('ctaTitle', 'Ready to Experience Luxury?');
    const ctaText = get('ctaText', '');
    const ctaButtonText = get('ctaButtonText', 'Reserve Your Room');
    const ctaImage = get('ctaImage', '');

    /* ── Hero auto-slide ── */
    useEffect(() => {
        if (heroImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => prev === heroImages.length - 1 ? 0 : prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="home-container">

            {/* ── HERO SLIDER ── */}
            <section className="home-hero-slider">
                <div className="home-hero-backgrounds">
                    {heroImages.length > 0 ? (
                        heroImages.map((img, index) => (
                            <div
                                key={index}
                                className={`home-hero-bg ${index === currentImageIndex ? 'home-bg-active' : ''}`}
                                style={{ backgroundImage: `url(/uploads/home/${img})` }}
                            />
                        ))
                    ) : (
                        <div className="home-hero-bg home-bg-active home-hero-fallback" />
                    )}
                    <div className="home-hero-overlay" />
                </div>

                <div className="home-hero-container">
                    <div className="home-hero-content">
                        <h1 className="home-hero-title">{heroTitle}</h1>
                        <p className="home-hero-subtitle">{heroSubtitle}</p>
                    </div>
                </div>

                {heroImages.length > 1 && (
                    <div className="home-hero-indicators">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`home-hero-indicator ${index === currentImageIndex ? 'home-indicator-active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── WELCOME SECTION ── */}
            <section className="home-welcome">
                <div className="home-welcome-container">
                    <div className="home-welcome-left">
                        {welcomeTag && <span className="home-section-tag">{welcomeTag}</span>}
                        {welcomeTitle && (
                            <h2 className="home-welcome-title">{welcomeTitle}</h2>
                        )}
                        {welcomeDescription && (
                            <p className="home-welcome-text">{welcomeDescription}</p>
                        )}
                    </div>

                    {welcomeImages.length > 0 && (
                        <div className="home-welcome-right">
                            <div className={`home-welcome-image-grid ${welcomeImages.length === 1 ? 'home-welcome-single' : ''}`}>
                                {welcomeImages.slice(0, 2).map((img, index) => (
                                    <img
                                        key={index}
                                        src={`/uploads/home/${img}`}
                                        alt={`Welcome ${index + 1}`}
                                        className={`home-welcome-img home-welcome-img-${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            {features.length > 0 && (
                <section className="home-features">
                    <div className="home-features-container">
                        {featuresTag && <span className="home-section-tag home-tag-center">{featuresTag}</span>}
                        {featuresTitle && <h2 className="home-features-title">{featuresTitle}</h2>}
                        {featuresSubtitle && <p className="home-features-subtitle">{featuresSubtitle}</p>}

                        <div className="home-features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="home-feature-card">
                                    <div className="home-feature-icon">
                                        <Check size={28} />
                                    </div>
                                    {feature.title && <h3 className="home-feature-title">{feature.title}</h3>}
                                    {feature.description && <p className="home-feature-desc">{feature.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── ROOMS SECTION ── */}
            {rooms.length > 0 && (
                <section className="home-rooms">
                    <div className="home-rooms-container">
                        <div className="home-rooms-header">
                            {roomsTag && <span className="home-section-tag home-tag-center">{roomsTag}</span>}
                            {roomsTitle && <h2 className="home-rooms-title">{roomsTitle}</h2>}
                            {roomsSubtitle && <p className="home-rooms-subtitle">{roomsSubtitle}</p>}
                        </div>
                        <div className="home-rooms-grid">
                            {rooms.map((room, index) => (
                                <div key={index} className="home-room-card">
                                    <div className="home-room-content">
                                        <div className="home-room-content-header">
                                            {room.title && <h3 className="home-room-title">{room.title}</h3>}
                                            {room.price && <span className="home-room-badge">{room.price}</span>}
                                        </div>
                                        {room.description && <p className="home-room-desc">{room.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── TESTIMONIALS SECTION ── */}
            {testimonials.length > 0 && (
                <section className="home-testimonials">
                    <div className="home-testimonials-container">
                        {testimonialsTag && <span className="home-section-tag home-tag-center">{testimonialsTag}</span>}
                        {testimonialsTitle && <h2 className="home-testimonials-title">{testimonialsTitle}</h2>}
                        <div className="home-testimonials-grid">
                            {testimonials.map((t, index) => (
                                <div key={index} className="home-testimonial-card">
                                    <div className="home-testimonial-stars">
                                        {'★'.repeat(parseInt(t.stars) || 5)}
                                    </div>
                                    {t.text && <p className="home-testimonial-text">"{t.text}"</p>}
                                    <div className="home-testimonial-author">
                                        {t.name && <h4 className="home-testimonial-name">{t.name}</h4>}
                                        {t.role && <p className="home-testimonial-role">{t.role}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA SECTION ── */}
            <section
                className="home-cta"
                style={ctaImage ? { backgroundImage: `url(/uploads/home/${ctaImage})` } : {}}
            >
                <div className="home-cta-overlay" />
                <div className="home-cta-container">
                    {ctaTitle && <h2 className="home-cta-title">{ctaTitle}</h2>}
                    {ctaText && <p className="home-cta-text">{ctaText}</p>}
                    {ctaButtonText && <button className="home-cta-btn">{ctaButtonText}</button>}
                </div>
            </section>

        </div>
    );
}