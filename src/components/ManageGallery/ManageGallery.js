"use client";

/* Plugins. */
import { useState, useEffect } from "react";
import { showToast } from "nextjs-toast-notify";
import { HiOutlinePhotograph } from "react-icons/hi";
import { CgTrash } from "react-icons/cg";

/* Style. */
import './manageGallery.css';

const ManageGallery = () => {

    /* State management. */
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /* Fetch existing images on component mount. */
    useEffect(() => {
        fetchGalleryImages();
    }, []);

    /* Fetch gallery images from API. */
    const fetchGalleryImages = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/siteSettings/gallery');
            const result = await response.json();

            if (result.success) {
                setExistingImages(result.images || []);
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /* Handle multiple image upload. */
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const validFiles = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                showToast.error(`${file.name} is not a valid image file`, {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                showToast.error(`${file.name} exceeds 10MB limit`, {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
                continue;
            }

            validFiles.push(file);
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    file: file,
                    preview: reader.result,
                    isNew: true
                }]);
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    };

    /* Delete new image (not uploaded yet). */
    const handleDeleteNewImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
        showToast.success('Image removed', {
            duration: 2000,
            progress: true,
            position: "bottom-right",
            transition: "bounceIn"
        });
    };

    /* Delete existing image from server. */
    const handleDeleteExistingImage = async (imageId) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch(`/api/siteSettings/gallery?id=${imageId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                setExistingImages(prev => prev.filter(img => img._id !== imageId));
                showToast.success('Image deleted successfully', {
                    duration: 3000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
            } else {
                throw new Error(result.message || 'Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            showToast.error(error.message || 'Failed to delete image', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    /* Submit images to API. */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            showToast.error('Please upload at least one image', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            images.forEach((image) => {
                if (image.isNew) {
                    formData.append('images', image.file);
                }
            });

            const response = await fetch('/api/siteSettings/gallery', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                showToast.success(result.message || 'Gallery images uploaded successfully!', {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });

                setImages([]);
                fetchGalleryImages();
            } else {
                throw new Error(result.message || 'Failed to upload images');
            }

        } catch (error) {
            console.error('Error uploading images:', error);
            showToast.error(error.message || 'Something went wrong', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="manage-gallery-container">

            <form onSubmit={handleSubmit} noValidate>
                {/* Image Upload Section */}
                <div className="manage-gallery-upload-section">
                    <div className="manage-gallery-upload-wrapper">
                        <div className="manage-gallery-upload-area">
                            <HiOutlinePhotograph className="manage-gallery-upload-icon" />
                            <span className="manage-gallery-upload-text">Drag and drop images or click to upload</span>
                            <span className="manage-gallery-upload-subtext">Support for multiple images (Max 10MB each)</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                id="gallery-upload"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="gallery-upload" className="manage-gallery-upload-button">
                                Choose Images
                            </label>
                        </div>
                    </div>
                </div>

                {/* Display New Images to Upload */}
                {images.length > 0 && (
                    <div className="manage-gallery-images-preview-section">
                        <h3 className="manage-gallery-preview-title">New Images to Upload ({images.length})</h3>
                        <div className="manage-gallery-images-grid">
                            {images.map((image) => (
                                <div key={image.id} className="manage-gallery-image-card">
                                    <div className="manage-gallery-image-delete-wrapper" onClick={() => handleDeleteNewImage(image.id)}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                    <img
                                        src={image.preview}
                                        alt="Gallery"
                                        className="manage-gallery-preview-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {images.length > 0 && (
                    <div className="manage-gallery-submit-section">
                        <button
                            type="submit"
                            className="manage-gallery-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload to Gallery'}
                        </button>
                    </div>
                )}
            </form>

            {/* Display Existing Gallery Images */}
            {isLoading ? (
                <div className="manage-gallery-loading-section">Loading gallery images...</div>
            ) : existingImages.length > 0 && (
                <div className="manage-gallery-existing-images-section">
                    <h3 className="manage-gallery-existing-title">Gallery Images ({existingImages.length})</h3>
                    <div className="manage-gallery-images-grid">
                        {existingImages.map((image) => (
                            <div key={image._id} className="manage-gallery-image-card">
                                <div className="manage-gallery-image-delete-wrapper" onClick={() => handleDeleteExistingImage(image._id)}>
                                    <CgTrash color="#ffffff" />
                                </div>
                                <img
                                    src={`/uploads/gallery/${image.image}`}
                                    alt="Gallery"
                                    className="manage-gallery-preview-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;