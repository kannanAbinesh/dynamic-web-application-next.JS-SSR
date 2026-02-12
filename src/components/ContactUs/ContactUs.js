"use client";
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';
import './contact.css';
import { useForm, Controller } from "react-hook-form";
import { showToast } from 'nextjs-toast-notify';
import CommonInputField from '../CommonInputField/CommonInputField';

const ContactUs = () => {
    /* Hooks declarations. */
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    const handleFormSubmit = async (data) => {
        try {
            console.log('Form data:', data);

            // Your API call here
            const response = await fetch('/api/users/addQueries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });

            showToast.success('Message sent successfully!', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });

            // reset(); // Reset form after successful submission

        } catch (error) {
            showToast.error(error?.message || 'Something went wrong!', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    return (
        <div className="contact-page">
            <section className="contact-hero-section">
                <div className="contact-hero-container">
                    {/* Left Side - Images and Text */}
                    <div className="contact-hero-left">
                        {/* Hero Images */}
                        <div className="hero-images">
                            <div className="hero-image-item square">
                                <img src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=200&fit=crop" alt="Lion" />
                            </div>
                            <div className="hero-image-item circle">
                                <img src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop" alt="Panda" />
                            </div>
                            <div className="hero-image-item triangle">
                                <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&h=200&fit=crop" alt="Temple" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="hero-text-content">
                            <h1 className="hero-main-title">Have an idea? Let&apos;s collaborate</h1>
                            <p className="hero-description">
                                We&apos;re open to new opportunities and ready to take on your next project.
                                Whether you already have a clear vision or simply need professional guidance,
                                our team is here to help.
                            </p>
                            <p className="hero-cta-text">
                                Feel free to reach out via email or give us a call — we&apos;d love to collaborate with you!
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="hero-contact-info">
                            <h3 className="contact-info-title">LET&apos;S CONNECT</h3>

                            <div className="contact-info-grid">
                                <div className="contact-info-column">
                                    <div className="contact-info-item">
                                        <Phone size={20} className="contact-icon" />
                                        <p className="contact-phone-number">+1 628-234-6708</p>
                                    </div>

                                    <div className="contact-info-item">
                                        <Mail size={20} className="contact-icon" />
                                        <p className="contact-email-address">hello@foks.com.us</p>
                                    </div>
                                </div>

                                <div className="contact-info-column">
                                    <div className="contact-info-item">
                                        <MapPin size={20} className="contact-icon" />
                                        <p className="contact-address">San Francisco, CA, USA</p>
                                    </div>

                                    <div className="contact-info-item">
                                        <div className="contact-hours">
                                            Monday- Friday: 8:00am-9:30pm<br />
                                            Saturday: 8:00am-4:30pm<br />
                                            Sunday: Closed
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Icons */}
                            <div className="social-media-section">
                                <div className="social-icons">
                                    <Link href="#" className="social-icon" aria-label="Facebook">
                                        <Facebook size={20} />
                                    </Link>
                                    <Link href="#" className="social-icon" aria-label="Twitter">
                                        <Twitter size={20} />
                                    </Link>
                                    <Link href="#" className="social-icon" aria-label="Instagram">
                                        <Instagram size={20} />
                                    </Link>
                                    <Link href="#" className="social-icon" aria-label="LinkedIn">
                                        <Linkedin size={20} />
                                    </Link>
                                    <Link href="#" className="social-icon" aria-label="YouTube">
                                        <Youtube size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                                            <CommonInputField
                                                field={field}
                                                fieldState={fieldState}
                                                formState={formState}
                                                type="text"
                                                placeholder="Your Name"
                                                required
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
                                            <CommonInputField
                                                field={field}
                                                fieldState={fieldState}
                                                formState={formState}
                                                type="email"
                                                placeholder="Your Email"
                                                required
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
                                                    placeholder="Your Message"
                                                    className="form-textarea"
                                                />
                                                {fieldState.error && (
                                                    <span className="error-message" style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
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