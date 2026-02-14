'use client';

/* Plugins. */
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { showToast } from "nextjs-toast-notify";
import { CgTrash } from "react-icons/cg";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdAdd } from "react-icons/md";

/* Style. */
import './manageBlogs.css';

const ManageBlogs = () => {

    /* State management. */
    const [blogImages, setBlogImages] = useState({});
    const [existingBlogs, setExistingBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks declarations. */
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            blogs: [
                {
                    header: '',
                    description: '',
                    date: '',
                    time: '',
                    images: []
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "blogs"
    });

    /* Fetch existing blogs on component mount. */
    useEffect(() => {
        fetchBlogs();
    }, []);

    /* Fetch blogs from API. */
    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/blogs/manageBlogs');
            const result = await response.json();

            if (result.success) {
                setExistingBlogs(result.blogs || []);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /* Handle multiple image upload for specific blog. */
    const handleImageUpload = (e, index) => {
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

            if (file.size > 5 * 1024 * 1024) {
                showToast.error(`${file.name} exceeds 5MB limit`, {
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
                setBlogImages(prev => ({
                    ...prev,
                    [index]: [
                        ...(prev[index] || []),
                        {
                            id: Date.now() + Math.random(),
                            file: file,
                            preview: reader.result,
                            isNew: true
                        }
                    ]
                }));
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    };

    /* Delete image from blog. */
    const handleDeleteImage = (blogIndex, imageId) => {
        setBlogImages(prev => ({
            ...prev,
            [blogIndex]: prev[blogIndex].filter(img => img.id !== imageId)
        }));
    };

    /* Submit blogs to API. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();

            // Append each blog with its images
            data.blogs.forEach((blog, index) => {
                formDataToSend.append(`blogs[${index}][header]`, blog.header || '');
                formDataToSend.append(`blogs[${index}][description]`, blog.description || '');
                formDataToSend.append(`blogs[${index}][date]`, blog.date || '');
                formDataToSend.append(`blogs[${index}][time]`, blog.time || '');

                // Append images for this blog
                const images = blogImages[index] || [];
                images.forEach((image) => {
                    if (image.isNew) {
                        formDataToSend.append(`blogs[${index}][images]`, image.file);
                    }
                });
            });

            const response = await fetch('/api/blogs/manageBlogs', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                showToast.success('Blogs created successfully!', {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });

                // Reset form
                reset({
                    blogs: [
                        {
                            header: '',
                            description: '',
                            date: '',
                            time: '',
                            images: []
                        }
                    ]
                });
                setBlogImages({});

                // Refresh blogs
                fetchBlogs();
            } else {
                throw new Error(result.message || 'Failed to create blogs');
            }

        } catch (error) {
            console.error('Error submitting blogs:', error);
            showToast.error(error.message || 'Something went wrong', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    /* Delete existing blog. */
    const handleDeleteBlog = async (blogId) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/blogs/manageBlogs?id=${blogId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                setExistingBlogs(prev => prev.filter(blog => blog._id !== blogId));
                showToast.success('Blog deleted successfully', {
                    duration: 3000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
            } else {
                throw new Error(result.message || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showToast.error(error.message || 'Failed to delete blog', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    return (
        <div className="manage-blogs-container">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <div className="blogs-grid">
                    {fields.map((field, index) => (
                        <div key={field.id} className="blog-card">
                            <div className="blog-card-header">
                                <h3 className="blog-number">Blog #{index + 1}</h3>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-blog-btn"
                                        onClick={() => {
                                            remove(index);
                                            setBlogImages(prev => {
                                                const newImages = { ...prev };
                                                delete newImages[index];
                                                return newImages;
                                            });
                                        }}
                                    >
                                        <CgTrash />
                                    </button>
                                )}
                            </div>

                            <div className="blog-form-content">
                                {/* Header */}
                                <div className="form-group">
                                    <label className="form-label">Blog Header *</label>
                                    <Controller
                                        name={`blogs.${index}.header`}
                                        control={control}
                                        rules={{ required: 'Blog header is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter blog header"
                                                    className={`form-input ${error ? 'error' : ''}`}
                                                />
                                                {error && <span className="error-message">{error.message}</span>}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label">Blog Description *</label>
                                    <Controller
                                        name={`blogs.${index}.description`}
                                        control={control}
                                        rules={{ required: 'Blog description is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <textarea
                                                    {...field}
                                                    rows={4}
                                                    placeholder="Enter blog description"
                                                    className={`form-textarea ${error ? 'error' : ''}`}
                                                />
                                                {error && <span className="error-message">{error.message}</span>}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Date and Time Row */}
                                <div className="datetime-row">
                                    <div className="form-group">
                                        <label className="form-label">Date *</label>
                                        <Controller
                                            name={`blogs.${index}.date`}
                                            control={control}
                                            rules={{ required: 'Date is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <div className="date-input-wrapper">
                                                        <input
                                                            {...field}
                                                            type="date"
                                                            className={`form-input ${error ? 'error' : ''}`}
                                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                        />
                                                    </div>
                                                    {error && <span className="error-message">{error.message}</span>}
                                                </>
                                            )}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Time *</label>
                                        <Controller
                                            name={`blogs.${index}.time`}
                                            control={control}
                                            rules={{ required: 'Time is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <div className="time-input-wrapper">
                                                        <input
                                                            {...field}
                                                            type="time"
                                                            className={`form-input ${error ? 'error' : ''}`}
                                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                        />
                                                    </div>
                                                    {error && <span className="error-message">{error.message}</span>}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="blog-images-section">
                                    <label className="form-label">Blog Images</label>
                                    <div className="image-upload-compact">
                                        <HiOutlinePhotograph className="upload-icon-tiny" />
                                        <span className="upload-text-tiny">Add images</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            id={`blog-images-${index}`}
                                            onChange={(e) => handleImageUpload(e, index)}
                                        />
                                        <label htmlFor={`blog-images-${index}`} className="upload-btn-tiny">
                                            Choose
                                        </label>
                                    </div>

                                    {/* Display uploaded images in horizontal scroll */}
                                    {blogImages[index] && blogImages[index].length > 0 && (
                                        <div className="blog-images-scroll">
                                            {blogImages[index].map((image) => (
                                                <div key={image.id} className="blog-image-thumb">
                                                    <div
                                                        className="blog-image-delete-tiny"
                                                        onClick={() => handleDeleteImage(index, image.id)}
                                                    >
                                                        <CgTrash />
                                                    </div>
                                                    <img
                                                        src={image.preview}
                                                        alt="Blog"
                                                        className="blog-image-preview-tiny"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        type="button"
                        className="add-blog-btn"
                        onClick={() => append({
                            header: '',
                            description: '',
                            date: '',
                            time: '',
                            images: []
                        })}
                    >
                        <MdAdd /> Add Blog
                    </button>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save All Blogs'}
                    </button>
                </div>
            </form>

            {/* Display Existing Blogs */}
            {isLoading ? (
                <div className="loading-section">Loading blogs...</div>
            ) : existingBlogs.length > 0 ? (
                <div className="existing-blogs-section">
                    <h3 className="existing-title">Published Blogs ({existingBlogs.length})</h3>
                    <div className="existing-blogs-grid">
                        {existingBlogs.map((blog) => (
                            <div key={blog._id} className="existing-blog-card">
                                <div className="existing-blog-delete" onClick={() => handleDeleteBlog(blog._id)}>
                                    <CgTrash />
                                </div>
                                {blog.images && blog.images.length > 0 && (
                                    <div className="existing-blog-image">
                                        <img
                                            src={`/uploads/blogs/${blog.images[0].image}`}
                                            alt={blog.header}
                                        />
                                        {blog.images.length > 1 && (
                                            <div className="image-count-badge">
                                                +{blog.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="existing-blog-content">
                                    <h4 className="existing-blog-header">{blog.header}</h4>
                                    <p className="existing-blog-description">{blog.description}</p>
                                    <div className="existing-blog-meta">
                                        <span className="blog-date">{new Date(blog.date).toLocaleDateString()}</span>
                                        <span className="blog-time">{blog.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-blogs-section">No blogs published yet</div>
            )}
        </div>
    );
};

export default ManageBlogs;