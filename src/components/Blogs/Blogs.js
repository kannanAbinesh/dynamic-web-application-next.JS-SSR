"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './blogs.css';

const Blog = () => {
    // Blog data with multiple images for each post
    const blogPosts = [
        {
            id: 1,
            title: "Top 10 Luxury Hotel Amenities You Can't Miss",
            excerpt: "Discover the most sought-after amenities that define luxury hospitality in modern hotels.",
            author: "Sarah Mitchell",
            date: "February 5, 2026",
            category: "Luxury Travel",
            readTime: "5 min read",
            images: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 2,
            title: "The Art of Fine Dining: A Culinary Journey",
            excerpt: "Explore the exquisite dining experiences that await you at our award-winning restaurants.",
            author: "Michael Chen",
            date: "February 3, 2026",
            category: "Dining",
            readTime: "7 min read",
            images: [
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 3,
            title: "Wellness & Spa: Your Ultimate Relaxation Guide",
            excerpt: "Indulge in our world-class spa treatments designed to rejuvenate your mind, body, and soul.",
            author: "Emma Rodriguez",
            date: "February 1, 2026",
            category: "Wellness",
            readTime: "6 min read",
            images: [
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 4,
            title: "Destination Weddings: Making Dreams Come True",
            excerpt: "Plan your perfect wedding celebration in our elegant venues with stunning backdrops.",
            author: "Jennifer Park",
            date: "January 28, 2026",
            category: "Events",
            readTime: "8 min read",
            images: [
                'https://images.unsplash.com/photo-1519167758481-83f29da8fd49?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 5,
            title: "Business Travel: Productivity Meets Comfort",
            excerpt: "Discover how our business facilities and services cater to the modern professional traveler.",
            author: "David Kumar",
            date: "January 25, 2026",
            category: "Business",
            readTime: "5 min read",
            images: [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 6,
            title: "Exploring Local Culture and Attractions",
            excerpt: "Your guide to the best cultural experiences and attractions near our hotel.",
            author: "Lisa Anderson",
            date: "January 22, 2026",
            category: "Local Guide",
            readTime: "6 min read",
            images: [
                'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1520520688068-3c5bc6ec664e?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 7,
            title: "Sustainable Luxury: Our Green Initiatives",
            excerpt: "Learn about our commitment to environmental sustainability and eco-friendly practices.",
            author: "Robert Green",
            date: "January 20, 2026",
            category: "Sustainability",
            readTime: "7 min read",
            images: [
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 8,
            title: "Family Vacations: Creating Lasting Memories",
            excerpt: "Discover family-friendly activities and amenities that make our hotel perfect for all ages.",
            author: "Maria Santos",
            date: "January 18, 2026",
            category: "Family Travel",
            readTime: "6 min read",
            images: [
                'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop',
            ]
        },
        {
            id: 9,
            title: "The Perfect Staycation: Rediscover Your City",
            excerpt: "Sometimes the best vacation is right in your backyard. Here's how to make it special.",
            author: "Alex Thompson",
            date: "January 15, 2026",
            category: "Staycation",
            readTime: "5 min read",
            images: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop',
            ]
        }
    ];

    // State for image carousels
    const [currentImageIndexes, setCurrentImageIndexes] = useState(
        blogPosts.reduce((acc, post) => ({ ...acc, [post.id]: 0 }), {})
    );

    const handlePrevImage = (postId, totalImages) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [postId]: prev[postId] === 0 ? totalImages - 1 : prev[postId] - 1
        }));
    };

    const handleNextImage = (postId, totalImages) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [postId]: prev[postId] === totalImages - 1 ? 0 : prev[postId] + 1
        }));
    };

    return (
        <div className="blog-page">

            {/* Blog Grid Section */}
            <section className="blog-content">
                <div className="blog-content-container">
                    <div className="blog-grid">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="blog-card">
                                {/* Image Carousel */}
                                <div className="blog-card-image-wrapper">
                                    <div className="blog-card-images">
                                        {post.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`blog-card-image-slide ${index === currentImageIndexes[post.id] ? 'blog-slide-active' : ''
                                                    }`}
                                                style={{ backgroundImage: `url(${image})` }}
                                            />
                                        ))}
                                    </div>

                                    {/* Carousel Controls */}
                                    {post.images.length > 1 && (
                                        <>
                                            <button
                                                className="blog-card-nav blog-card-nav-prev"
                                                onClick={() => handlePrevImage(post.id, post.images.length)}
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                className="blog-card-nav blog-card-nav-next"
                                                onClick={() => handleNextImage(post.id, post.images.length)}
                                                aria-label="Next image"
                                            >
                                                <ChevronRight size={20} />
                                            </button>

                                            {/* Image Indicators */}
                                            <div className="blog-card-indicators">
                                                {post.images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`blog-card-indicator ${index === currentImageIndexes[post.id] ? 'blog-indicator-active' : ''
                                                            }`}
                                                        onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [post.id]: index }))}
                                                        aria-label={`Go to image ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Category Badge */}
                                    <div className="blog-card-category">{post.category}</div>
                                </div>

                                {/* Card Content */}
                                <div className="blog-card-content">
                                    <div className="blog-card-meta">
                                        <span className="blog-card-meta-item">
                                            <Calendar size={16} />
                                            {post.date}
                                        </span>
                                        <span className="blog-card-meta-item">
                                            <User size={16} />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h2 className="blog-card-title">{post.title}</h2>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>

                                    <div className="blog-card-footer">
                                        <span className="blog-card-read-time">{post.readTime}</span>
                                        <button className="blog-card-read-more">
                                            Read More
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="blog-load-more">
                        <button className="blog-load-more-btn">Load More Articles</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;