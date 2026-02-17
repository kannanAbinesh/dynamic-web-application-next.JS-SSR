"use client";

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import './aboutUs.css';

const AboutUs = ({ formData = {} }) => {

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    /* Extract data from formData */
    const bannerHeader = formData?.bannerHeader?.value || '';
    const bannerDescription = formData?.bannerDescription?.value || '';
    const mainDescription = formData?.mainDescription?.value || '';
    const bannerImages = formData?.bannerImages?.value || [];
    const videoName = formData?.video?.value || '';
    const cards = formData?.cards?.value || [];

    /* Auto-change background every 5 seconds */
    useEffect(() => {
        if (bannerImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev =>
                prev === bannerImages.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [bannerImages.length]);

    return (
        <div className="about-us-page">

            {/* ── Video Modal ── */}
            {isVideoPlaying && videoName && (
                <div className="about-us-video-modal" onClick={() => setIsVideoPlaying(false)}>
                    <div className="about-us-video-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="about-us-video-close"
                            onClick={() => setIsVideoPlaying(false)}
                            aria-label="Close video"
                        >
                            <X size={28} />
                        </button>
                        <video
                            src={`/uploads/aboutUs/${videoName}`}
                            controls
                            autoPlay
                            className="about-us-video-player"
                        />
                    </div>
                </div>
            )}

            {/* ── Hero Section ── */}
            <section className="about-us-hero">

                {/* Background Slideshow */}
                {bannerImages.length > 0 && (
                    <div className="about-us-hero-backgrounds">
                        {bannerImages.map((image, index) => (
                            <div
                                key={index}
                                className={`about-us-hero-bg ${index === currentImageIndex ? 'about-us-bg-active' : ''}`}
                                style={{ backgroundImage: `url(/uploads/aboutUs/${image})` }}
                            />
                        ))}
                        <div className="about-us-hero-overlay" />
                    </div>
                )}

                {/* Hero Content */}
                <div className="about-us-hero-container">
                    <div className="about-us-hero-content">
                        {bannerHeader && (
                            <h1 className="about-us-hero-title">{bannerHeader}</h1>
                        )}
                        {bannerDescription && (
                            <p className="about-us-hero-text">{bannerDescription}</p>
                        )}

                        {/* Video Thumbnail */}
                        {videoName && (
                            <div
                                className="about-us-hero-video"
                                onClick={() => setIsVideoPlaying(true)}
                            >
                                <video
                                    src={`/uploads/aboutUs/${videoName}`}
                                    className="about-us-hero-video-thumb"
                                    muted
                                    preload="metadata"
                                />
                                <div className="about-us-hero-play">
                                    <Play size={28} fill="currentColor" />
                                </div>
                                <span className="about-us-hero-video-text">Watch Our Story</span>
                            </div>
                        )}
                    </div>

                    {/* Slideshow Indicators */}
                    {bannerImages.length > 1 && (
                        <div className="about-us-hero-indicators">
                            {bannerImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`about-us-hero-indicator ${index === currentImageIndex ? 'about-us-indicator-active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Main Description Section ── */}
            {mainDescription && (
                <section className="about-us-heritage">
                    <div className="about-us-heritage-container">
                        <div className="about-us-heritage-content">
                            <p className="about-us-heritage-text">{mainDescription}</p>
                        </div>

                        {/* ── Cards / Stats Section ── */}
                        {cards.length > 0 && (
                            <div
                                className="about-us-heritage-stats"
                                style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)` }}
                            >
                                {cards.map((card, index) => (
                                    <div key={index} className="about-us-stat">
                                        {card.count && (
                                            <h3 className="about-us-stat-number">{card.count}</h3>
                                        )}
                                        {card.header && (
                                            <p className="about-us-stat-label">{card.header}</p>
                                        )}
                                        {card.description && (
                                            <p className="about-us-stat-description">{card.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default AboutUs;