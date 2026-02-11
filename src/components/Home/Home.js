"use client";

import React, { useState, useEffect } from 'react';
import { Play, X, Check } from 'lucide-react';
import './home.css';

export default function Home() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Hotel background images for slider
    const heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
            title: 'Luxury Redefined',
            subtitle: 'Experience unparalleled elegance and comfort'
        },
        {
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop',
            title: 'Your Perfect Escape',
            subtitle: 'Where every moment becomes a memory'
        },
        {
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop',
            title: 'Unforgettable Experiences',
            subtitle: 'Indulge in world-class hospitality'
        },
        {
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop',
            title: 'Premium Comfort',
            subtitle: 'Designed for the discerning traveler'
        },
    ];

    // Auto-change slider every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === heroSlides.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleVideoClick = () => {
        setIsVideoPlaying(true);
    };

    const handleCloseVideo = () => {
        setIsVideoPlaying(false);
    };

    return (
        <div className="home-container">
            {/* Video Modal */}
            {isVideoPlaying && (
                <div className="home-video-modal" onClick={handleCloseVideo}>
                    <div className="home-video-content" onClick={(e) => e.stopPropagation()}>
                        <button className="home-video-close" onClick={handleCloseVideo} aria-label="Close video">
                            <X size={24} />
                        </button>
                        <div className="home-video-wrapper">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/ZXsQAXx_ao0?autoplay=1"
                                title="Hotel video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Slider Section */}
            <section className="home-hero-slider">
                {/* Background Images Slideshow */}
                <div className="home-hero-backgrounds">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`home-hero-bg ${index === currentImageIndex ? 'home-bg-active' : ''}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                    ))}
                    <div className="home-hero-overlay" />
                </div>

                {/* Hero Content */}
                <div className="home-hero-container">
                    <div className="home-hero-content">
                        <h1 className="home-hero-title">{heroSlides[currentImageIndex].title}</h1>
                        <p className="home-hero-subtitle">{heroSlides[currentImageIndex].subtitle}</p>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="home-welcome">
                <div className="home-welcome-container">
                    <div className="home-welcome-left">
                        <span className="home-section-tag">Welcome To Our Hotel</span>
                        <h2 className="home-welcome-title">
                            Experience the finest <span className="home-highlight">luxury hospitality</span>
                        </h2>
                        <p className="home-welcome-text">
                            Nestled in the heart of the city, our hotel offers an exquisite blend of
                            timeless elegance and modern sophistication. Each detail has been carefully
                            curated to ensure your stay exceeds every expectation.
                        </p>
                        <p className="home-welcome-text">
                            From our award-winning restaurants to our state-of-the-art facilities,
                            we provide an unforgettable experience that celebrates the art of fine living.
                        </p>
                        <button className="home-welcome-btn">Discover More</button>
                    </div>
                    <div className="home-welcome-right">
                        <div className="home-welcome-image-grid">
                            <img
                                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=700&fit=crop"
                                alt="Hotel exterior"
                                className="home-welcome-img home-welcome-img-1"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop"
                                alt="Luxury room"
                                className="home-welcome-img home-welcome-img-2"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="home-features">
                <div className="home-features-container">
                    <span className="home-section-tag home-tag-center">Our Excellence</span>
                    <h2 className="home-features-title">Why Choose Us</h2>
                    <p className="home-features-subtitle">
                        We pride ourselves on delivering exceptional service and unforgettable experiences
                    </p>

                    <div className="home-features-grid">
                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Prime Location</h3>
                            <p className="home-feature-desc">
                                Situated in the heart of the city with easy access to major attractions,
                                shopping districts, and business centers.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Luxury Amenities</h3>
                            <p className="home-feature-desc">
                                Enjoy world-class facilities including spa, fitness center, infinity pool,
                                and fine dining restaurants.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Exceptional Service</h3>
                            <p className="home-feature-desc">
                                Our dedicated staff provides 24/7 concierge service to ensure your every
                                need is met with perfection.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Elegant Rooms</h3>
                            <p className="home-feature-desc">
                                Each room is thoughtfully designed with premium furnishings, modern
                                technology, and breathtaking views.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Award-Winning Dining</h3>
                            <p className="home-feature-desc">
                                Savor exquisite cuisine prepared by renowned chefs in our multiple
                                restaurants and bars.
                            </p>
                        </div>

                        <div className="home-feature-card">
                            <div className="home-feature-icon">
                                <Check size={32} />
                            </div>
                            <h3 className="home-feature-title">Event Spaces</h3>
                            <p className="home-feature-desc">
                                Host unforgettable events in our versatile venues equipped with
                                cutting-edge technology and elegant décor.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Showcase */}
            <section className="home-rooms">
                <div className="home-rooms-container">
                    <div className="home-rooms-header">
                        <span className="home-section-tag">Accommodations</span>
                        <h2 className="home-rooms-title">
                            Our <span className="home-highlight">Signature Suites</span>
                        </h2>
                        <p className="home-rooms-subtitle">
                            Every room is a sanctuary of comfort and style, designed to make your stay extraordinary
                        </p>
                    </div>

                    <div className="home-rooms-grid">
                        <div className="home-room-card">
                            <div className="home-room-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop"
                                    alt="Deluxe room"
                                    className="home-room-image"
                                />
                                <div className="home-room-badge">From $299/night</div>
                            </div>
                            <div className="home-room-content">
                                <h3 className="home-room-title">Deluxe Room</h3>
                                <p className="home-room-desc">
                                    Spacious rooms with modern amenities, king-size bed, and city views.
                                </p>
                            </div>
                        </div>

                        <div className="home-room-card">
                            <div className="home-room-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop"
                                    alt="Executive suite"
                                    className="home-room-image"
                                />
                                <div className="home-room-badge">From $499/night</div>
                            </div>
                            <div className="home-room-content">
                                <h3 className="home-room-title">Executive Suite</h3>
                                <p className="home-room-desc">
                                    Elegant suites with separate living area, premium furnishings, and panoramic views.
                                </p>
                            </div>
                        </div>

                        <div className="home-room-card">
                            <div className="home-room-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"
                                    alt="Presidential suite"
                                    className="home-room-image"
                                />
                                <div className="home-room-badge">From $999/night</div>
                            </div>
                            <div className="home-room-content">
                                <h3 className="home-room-title">Presidential Suite</h3>
                                <p className="home-room-desc">
                                    Ultimate luxury with private terrace, butler service, and bespoke amenities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="home-testimonials">
                <div className="home-testimonials-container">
                    <span className="home-section-tag home-tag-center">Guest Reviews</span>
                    <h2 className="home-testimonials-title">What Our Guests Say</h2>

                    <div className="home-testimonials-grid">
                        <div className="home-testimonial-card">
                            <div className="home-testimonial-stars">★★★★★</div>
                            <p className="home-testimonial-text">
                                "An absolutely exceptional experience from start to finish. The attention to
                                detail and personalized service made our anniversary truly unforgettable."
                            </p>
                            <div className="home-testimonial-author">
                                <h4 className="home-testimonial-name">Sarah Johnson</h4>
                                <p className="home-testimonial-role">Verified Guest</p>
                            </div>
                        </div>

                        <div className="home-testimonial-card">
                            <div className="home-testimonial-stars">★★★★★</div>
                            <p className="home-testimonial-text">
                                "The perfect blend of luxury and comfort. Every staff member went above and
                                beyond to ensure our stay was perfect. Highly recommended!"
                            </p>
                            <div className="home-testimonial-author">
                                <h4 className="home-testimonial-name">Michael Chen</h4>
                                <p className="home-testimonial-role">Business Traveler</p>
                            </div>
                        </div>

                        <div className="home-testimonial-card">
                            <div className="home-testimonial-stars">★★★★★</div>
                            <p className="home-testimonial-text">
                                "From the stunning rooms to the world-class dining, everything exceeded our
                                expectations. We can't wait to return for our next visit."
                            </p>
                            <div className="home-testimonial-author">
                                <h4 className="home-testimonial-name">Emily Rodriguez</h4>
                                <p className="home-testimonial-role">Leisure Traveler</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="home-cta">
                <div className="home-cta-overlay" />
                <div className="home-cta-container">
                    <h2 className="home-cta-title">Ready to Experience Luxury?</h2>
                    <p className="home-cta-text">
                        Book your stay today and discover why we're the preferred choice for discerning travelers
                    </p>
                    <button className="home-cta-btn">Reserve Your Room</button>
                </div>
            </section>
        </div>
    );
}