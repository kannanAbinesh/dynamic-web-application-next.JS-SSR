"use client";

import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import './aboutUs.css';

const AboutUs = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Hotel background images
    const backgroundImages = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop', // Luxury hotel lobby
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop', // Hotel room
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop', // Hotel pool
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop', // Hotel exterior
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop', // Hotel restaurant
    ];

    // Auto-change background every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
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
        <div className="about-us-page">
            {/* Video Modal */}
            {isVideoPlaying && (
                <div className="about-us-video-modal" onClick={handleCloseVideo}>
                    <div className="about-us-video-content" onClick={(e) => e.stopPropagation()}>
                        <button className="about-us-video-close" onClick={handleCloseVideo} aria-label="Close video">
                            <X size={24} />
                        </button>
                        <div className="about-us-video-wrapper">
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

            {/* Hero Section with Scrolling Background */}
            <section className="about-us-hero">
                {/* Background Images Slideshow */}
                <div className="about-us-hero-backgrounds">
                    {backgroundImages.map((image, index) => (
                        <div
                            key={index}
                            className={`about-us-hero-bg ${index === currentImageIndex ? 'about-us-bg-active' : ''}`}
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                    <div className="about-us-hero-overlay" />
                </div>

                {/* Hero Content */}
                <div className="about-us-hero-container">
                    <div className="about-us-hero-content">
                        <h1 className="about-us-hero-title">Our Story</h1>
                        <p className="about-us-hero-text">
                            Welcome to a world of unparalleled luxury and exceptional hospitality.
                            For over two decades, we have been crafting unforgettable experiences
                            for our distinguished guests, combining timeless elegance with modern comfort.
                        </p>
                        <p className="about-us-hero-text">
                            Our journey began with a vision to create more than just a place to stay,
                            but a destination where memories are made, stories are shared, and every
                            moment becomes a treasured experience.
                        </p>

                        {/* Video Thumbnail */}
                        <div className="about-us-hero-video" onClick={handleVideoClick}>
                            <img
                                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
                                alt="Hotel video thumbnail"
                                className="about-us-hero-video-thumb"
                            />
                            <div className="about-us-hero-play">
                                <Play size={30} fill="white" />
                            </div>
                        </div>
                    </div>

                    {/* Slideshow Indicators */}
                    <div className="about-us-hero-indicators">
                        {backgroundImages.map((_, index) => (
                            <button
                                key={index}
                                className={`about-us-hero-indicator ${index === currentImageIndex ? 'about-us-indicator-active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Heritage Section */}
            <section className="about-us-heritage">
                <div className="about-us-heritage-container">
                    <div className="about-us-heritage-content">
                        <h2 className="about-us-heritage-title">A Legacy of Excellence</h2>
                        <p className="about-us-heritage-text">
                            Established in 2003, our hotel has become a landmark of sophistication and
                            world-class service. We pride ourselves on our attention to detail, commitment
                            to sustainability, and dedication to creating personalized experiences for each guest.
                        </p>
                        <p className="about-us-heritage-text">
                            From our award-winning restaurants to our state-of-the-art spa and wellness center,
                            every aspect of our hotel is designed to exceed expectations. Our team of passionate
                            professionals works tirelessly to ensure that your stay with us is nothing short of extraordinary.
                        </p>
                    </div>
                    <div className="about-us-heritage-stats">
                        <div className="about-us-stat">
                            <h3 className="about-us-stat-number">20+</h3>
                            <p className="about-us-stat-label">Years of Excellence</p>
                        </div>
                        <div className="about-us-stat">
                            <h3 className="about-us-stat-number">500+</h3>
                            <p className="about-us-stat-label">Luxury Rooms</p>
                        </div>
                        <div className="about-us-stat">
                            <h3 className="about-us-stat-number">50+</h3>
                            <p className="about-us-stat-label">Awards Won</p>
                        </div>
                        <div className="about-us-stat">
                            <h3 className="about-us-stat-number">100K+</h3>
                            <p className="about-us-stat-label">Happy Guests</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;