"use client";

import { useState } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './blogs.css';

const Blogs = ({ initialBlogs = [] }) => {

    /* State for image carousels - keyed by blog _id */
    const [currentImageIndexes, setCurrentImageIndexes] = useState(
        initialBlogs.reduce((acc, blog) => ({ ...acc, [blog._id]: 0 }), {})
    );

    const handlePrevImage = (blogId, totalImages) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [blogId]: prev[blogId] === 0 ? totalImages - 1 : prev[blogId] - 1
        }));
    };

    const handleNextImage = (blogId, totalImages) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [blogId]: prev[blogId] === totalImages - 1 ? 0 : prev[blogId] + 1
        }));
    };

    if (initialBlogs.length === 0) {
        return (
            <div className="blogs-page">
                <section className="blogs-content">
                    <div className="blogs-content-container">
                        <div className="blogs-empty">No blogs published yet.</div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="blogs-page">
            <section className="blogs-content">
                <div className="blogs-content-container">
                    <div className="blogs-grid">
                        {initialBlogs.map((blog) => {
                            console.log(blog, 'blogblogblogblogblog')
                            const hasImages = blog.images && blog.images.length > 0;
                            const currentIndex = currentImageIndexes[blog._id] || 0;

                            return (
                                <article key={blog._id} className="blogs-card">

                                    {/* Image Carousel */}
                                    {hasImages && (
                                        <div className="blogs-card-image-wrapper">
                                            <div className="blogs-card-images">
                                                {blog.images.map((img, index) => (
                                                    <div
                                                        key={img._id}
                                                        className={`blogs-card-image-slide ${index === currentIndex ? 'blogs-slide-active' : ''}`}
                                                        style={{ backgroundImage: `url(/uploads/blogs/${img.image})` }}
                                                    />
                                                ))}
                                            </div>

                                            {/* Carousel Controls */}
                                            {blog.images.length > 1 && (
                                                <>
                                                    <button
                                                        className="blogs-card-nav blogs-card-nav-prev"
                                                        onClick={() => handlePrevImage(blog._id, blog.images.length)}
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        className="blogs-card-nav blogs-card-nav-next"
                                                        onClick={() => handleNextImage(blog._id, blog.images.length)}
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>

                                                    {/* Image Indicators */}
                                                    <div className="blogs-card-indicators">
                                                        {blog.images.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                className={`blogs-card-indicator ${index === currentIndex ? 'blogs-indicator-active' : ''}`}
                                                                onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [blog._id]: index }))}
                                                                aria-label={`Go to image ${index + 1}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* No image placeholder */}
                                    {!hasImages && (
                                        <div className="blogs-card-no-image">
                                            <span className="blogs-card-no-image-text">No Image</span>
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="blogs-card-content">
                                        <div className="blogs-card-meta">
                                            <span className="blogs-card-meta-item">
                                                <Calendar size={16} />
                                                {new Date(blog.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="blogs-card-meta-time">
                                                {blog.time}
                                            </span>
                                        </div>

                                        <h2 className="blogs-card-title">{blog.header}</h2>
                                        <p className="blogs-card-excerpt">{blog.description}</p>

                                        <div className="blogs-card-footer">
                                            <button className="blogs-card-read-more">
                                                Read More
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blogs;