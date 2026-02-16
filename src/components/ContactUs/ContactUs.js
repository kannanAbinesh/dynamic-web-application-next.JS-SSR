"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react';
import './contact.css';
import { useForm, Controller } from "react-hook-form";
import { showToast } from 'nextjs-toast-notify';
import { useSelector } from 'react-redux';

function ContactInput(props) {
    const { field, fieldState, type = "text", placeholder, ...customProps } = props;
    const { error } = fieldState;

    return (
        <>
            <input
                {...field}
                {...customProps}
                type={type}
                placeholder={placeholder}
                className={`form-input ${error ? 'error' : ''}`}
            />
            {error && (
                <span className="contact-error-message">
                    {error.message}
                </span>
            )}
        </>
    );
}

const ContactUs = ({ data = {} }) => {
    /* Redux - Get site settings */
    const siteSettings = useSelector((state) => state.siteSettings?.data || {});

    /* Hooks declarations. */
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    const handleFormSubmit = async (formData) => {
        try {
            const response = await fetch('/api/users/addQueries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showToast.success('Message sent successfully!', {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
                reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }

        } catch (error) {
            showToast.error(error?.message || 'Something went wrong!', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    // Extract data
    const header = data.header?.value || "Have an idea? Let's collaborate";
    const description = data.description?.value || "We're open to new opportunities and ready to take on your next project.";
    const triangleImage = data.triangleImage?.value;
    const squareImage = data.squareImage?.value;
    const circleImage = data.circleImage?.value;

    // Site settings
    const facebook = siteSettings.facebook?.value || '#';
    const instagram = siteSettings.instagram?.value || '#';
    const youtube = siteSettings.youtube?.value || '#';
    const mail = siteSettings.mail?.value || 'hello@example.com';
    const whatsapp = siteSettings.whatsapp?.value || '';

    return (
        <div className="contact-page">
            <section className="contact-hero-section">
                <div className="contact-hero-container">
                    {/* Left Side - Images and Text */}
                    <div className="contact-hero-left">
                        {/* Hero Images */}
                        <div className="hero-images">
                            {squareImage && (
                                <div className="hero-image-item square">
                                    <img src={`/uploads/contactUs/${squareImage}`} alt="Square" />
                                </div>
                            )}
                            {circleImage && (
                                <div className="hero-image-item circle">
                                    <img src={`/uploads/contactUs/${circleImage}`} alt="Circle" />
                                </div>
                            )}
                            {triangleImage && (
                                <div className="hero-image-item triangle">
                                    <img src={`/uploads/contactUs/${triangleImage}`} alt="Triangle" />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="hero-text-content">
                            <h1 className="hero-main-title">{header}</h1>
                            <p className="hero-description">{description}</p>
                        </div>

                        {/* Social Media Icons */}
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="contact-hero-right">
                        <div className="contact-form-card">
                            <h2 className="form-card-title">GET IN TOUCH</h2>

                            <form onSubmit={handleSubmit(handleFormSubmit)} className="contact-form">
                                {/* Name Input */}
                                <div className="form-group">
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{
                                            required: 'Name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters'
                                            }
                                        }}
                                        render={({ field, fieldState, formState }) => (
                                            <ContactInput
                                                field={field}
                                                fieldState={fieldState}
                                                formState={formState}
                                                type="text"
                                                placeholder="Your Name *"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="form-group">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        }}
                                        render={({ field, fieldState, formState }) => (
                                            <ContactInput
                                                field={field}
                                                fieldState={fieldState}
                                                formState={formState}
                                                type="email"
                                                placeholder="Your Email *"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Message Textarea */}
                                <div className="form-group">
                                    <Controller
                                        name="message"
                                        control={control}
                                        rules={{
                                            required: 'Message is required',
                                            minLength: {
                                                value: 10,
                                                message: 'Message must be at least 10 characters'
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <textarea
                                                    {...field}
                                                    placeholder="Your Message *"
                                                    className={`form-textarea ${fieldState.error ? 'error' : ''}`}
                                                />
                                                {fieldState.error && (
                                                    <span className="contact-error-message">
                                                        {fieldState.error.message}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>
                                            <span>Send message</span>
                                            <Send size={18} />
                                        </>
                                    )}
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