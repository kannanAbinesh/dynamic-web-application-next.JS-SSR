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

const ManageBlogs = ({ initialBlogs = [] }) => {

    /* State management. */
    const [blogImages, setBlogImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    /* Hooks declarations. */
    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            blogs: initialBlogs.length > 0 ? initialBlogs.map(blog => ({
                _id: blog._id || '',
                header: blog.header || '',
                description: blog.description || '',
                date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : '',
                time: blog.time || '',
                existingImages: blog.images || []
            })) : [{
                header: '',
                description: '',
                date: '',
                time: '',
                existingImages: []
            }]
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "blogs"
    });

    /* Update form when initialBlogs changes */
    useEffect(() => {
        console.log('initialBlogs:', initialBlogs);
        
        if (initialBlogs && initialBlogs.length > 0) {
            const formattedBlogs = initialBlogs.map(blog => {
                console.log('Blog images:', blog.images);
                return {
                    _id: blog._id || '',
                    header: blog.header || '',
                    description: blog.description || '',
                    date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : '',
                    time: blog.time || '',
                    existingImages: blog.images || []
                };
            });
            
            console.log('Formatted blogs:', formattedBlogs);
            replace(formattedBlogs);
        }
    }, [initialBlogs, replace]);

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

    /* Delete new image from blog. */
    const handleDeleteNewImage = (blogIndex, imageId) => {
        setBlogImages(prev => ({
            ...prev,
            [blogIndex]: prev[blogIndex].filter(img => img.id !== imageId)
        }));
    };

    /* Delete existing image from blog. */
    const handleDeleteExistingImage = (blogIndex, imageIndex, fieldValue) => {
        const updatedImages = [...fieldValue];
        updatedImages.splice(imageIndex, 1);
        return updatedImages;
    };

    /* Submit blogs to API. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();

            data.blogs.forEach((blog, index) => {
                // If blog has _id, it's an update, otherwise it's new
                if (blog._id) {
                    formDataToSend.append(`blogs[${index}][_id]`, blog._id);
                }
                
                formDataToSend.append(`blogs[${index}][header]`, blog.header || '');
                formDataToSend.append(`blogs[${index}][description]`, blog.description || '');
                formDataToSend.append(`blogs[${index}][date]`, blog.date || '');
                formDataToSend.append(`blogs[${index}][time]`, blog.time || '');

                // Append new images
                const images = blogImages[index] || [];
                images.forEach((image) => {
                    if (image.isNew) {
                        formDataToSend.append(`blogs[${index}][images]`, image.file);
                    }
                });

                // Append existing images that weren't deleted
                if (blog.existingImages && blog.existingImages.length > 0) {
                    blog.existingImages.forEach((img, imgIndex) => {
                        formDataToSend.append(`blogs[${index}][existingImages][${imgIndex}]`, img.image);
                    });
                }
            });

            const response = await fetch('/api/siteSettings/manage-blogs', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                showToast.success('Blogs saved successfully!', {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });

                setBlogImages({});
                
            } else {
                throw new Error(result.message || 'Failed to save blogs');
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

    /* Delete blog. */
    const handleDeleteBlog = async (blogId, index) => {
        if (!blogId) {
            // Just remove from form if it's a new blog
            remove(index);
            const newImages = { ...blogImages };
            delete newImages[index];
            setBlogImages(newImages);
            return;
        }

        try {
            const response = await fetch(`/api/siteSettings/manage-blogs?id=${blogId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                remove(index);
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
                {fields.length === 0 ? (
                    <div className="manage-blogs-no-blogs-section">
                        No blogs yet. Click "Add Blog" to create one.
                    </div>
                ) : (
                    <div className="manage-blogs-grid">
                        {fields.map((field, index) => {
                            console.log('Field data:', field);
                            console.log('Existing images for field:', field.existingImages);
                            
                            return (
                                <div key={field.id} className="manage-blogs-card">
                                    <div className="manage-blogs-card-header">
                                        <h3 className="manage-blogs-number">
                                            Blog #{index + 1} {field._id && <span style={{ fontSize: '12px', color: '#666' }}>(Existing)</span>}
                                        </h3>
                                        <button
                                            type="button"
                                            className="manage-blogs-remove-btn"
                                            onClick={() => handleDeleteBlog(field._id, index)}
                                        >
                                            <CgTrash />
                                        </button>
                                    </div>

                                    <div className="manage-blogs-form-content">
                                        {/* Hidden field for _id */}
                                        <Controller
                                            name={`blogs.${index}._id`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="hidden" />}
                                        />

                                        {/* Header */}
                                        <div className="manage-blogs-form-group">
                                            <label className="manage-blogs-form-label">Blog Header *</label>
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
                                                            className={`manage-blogs-form-input ${error ? 'manage-blogs-error' : ''}`}
                                                        />
                                                        {error && <span className="manage-blogs-error-message">{error.message}</span>}
                                                    </>
                                                )}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="manage-blogs-form-group">
                                            <label className="manage-blogs-form-label">Blog Description *</label>
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
                                                            className={`manage-blogs-form-textarea ${error ? 'manage-blogs-error' : ''}`}
                                                        />
                                                        {error && <span className="manage-blogs-error-message">{error.message}</span>}
                                                    </>
                                                )}
                                            />
                                        </div>

                                        {/* Date and Time Row */}
                                        <div className="manage-blogs-datetime-row">
                                            <div className="manage-blogs-form-group">
                                                <label className="manage-blogs-form-label">Date *</label>
                                                <Controller
                                                    name={`blogs.${index}.date`}
                                                    control={control}
                                                    rules={{ required: 'Date is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <>
                                                            <div className="manage-blogs-date-input-wrapper">
                                                                <input
                                                                    {...field}
                                                                    type="date"
                                                                    className={`manage-blogs-form-input ${error ? 'manage-blogs-error' : ''}`}
                                                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                />
                                                            </div>
                                                            {error && <span className="manage-blogs-error-message">{error.message}</span>}
                                                        </>
                                                    )}
                                                />
                                            </div>

                                            <div className="manage-blogs-form-group">
                                                <label className="manage-blogs-form-label">Time *</label>
                                                <Controller
                                                    name={`blogs.${index}.time`}
                                                    control={control}
                                                    rules={{ required: 'Time is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <>
                                                            <div className="manage-blogs-time-input-wrapper">
                                                                <input
                                                                    {...field}
                                                                    type="time"
                                                                    className={`manage-blogs-form-input ${error ? 'manage-blogs-error' : ''}`}
                                                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                />
                                                            </div>
                                                            {error && <span className="manage-blogs-error-message">{error.message}</span>}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload Section */}
                                        <div className="manage-blogs-images-section">
                                            <label className="manage-blogs-form-label">Blog Images</label>
                                            <div className="manage-blogs-image-upload-compact">
                                                <HiOutlinePhotograph className="manage-blogs-upload-icon-tiny" />
                                                <span className="manage-blogs-upload-text-tiny">Add images</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    style={{ display: 'none' }}
                                                    id={`blog-images-${index}`}
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                />
                                                <label htmlFor={`blog-images-${index}`} className="manage-blogs-upload-btn-tiny">
                                                    Choose
                                                </label>
                                            </div>

                                            {/* Display existing and new images */}
                                            <Controller
                                                name={`blogs.${index}.existingImages`}
                                                control={control}
                                                render={({ field: { value, onChange } }) => {
                                                    console.log('Controller value for existingImages:', value);
                                                    console.log('New images for index', index, ':', blogImages[index]);
                                                    
                                                    const hasExistingImages = value && Array.isArray(value) && value.length > 0;
                                                    const hasNewImages = blogImages[index] && blogImages[index].length > 0;
                                                    
                                                    console.log('Has existing images:', hasExistingImages);
                                                    console.log('Has new images:', hasNewImages);
                                                    
                                                    return (
                                                        <>
                                                            {(hasExistingImages || hasNewImages) && (
                                                                <div className="manage-blogs-images-scroll">
                                                                    {/* Existing images */}
                                                                    {hasExistingImages && value.map((image, imgIndex) => {
                                                                        console.log('Rendering existing image:', image);
                                                                        return (
                                                                            <div key={`existing-${imgIndex}`} className="manage-blogs-image-thumb">
                                                                                <div
                                                                                    className="manage-blogs-image-delete-tiny"
                                                                                    onClick={() => onChange(handleDeleteExistingImage(index, imgIndex, value))}
                                                                                >
                                                                                    <CgTrash />
                                                                                </div>
                                                                                <img
                                                                                    src={`/uploads/blogs/${image.image}`}
                                                                                    alt="Blog"
                                                                                    className="manage-blogs-image-preview-tiny"
                                                                                    onError={(e) => {
                                                                                        console.error('Image failed to load:', e.target.src);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    {/* New images */}
                                                                    {hasNewImages && blogImages[index].map((image) => (
                                                                        <div key={image.id} className="manage-blogs-image-thumb">
                                                                            <div
                                                                                className="manage-blogs-image-delete-tiny"
                                                                                onClick={() => handleDeleteNewImage(index, image.id)}
                                                                            >
                                                                                <CgTrash />
                                                                            </div>
                                                                            <img
                                                                                src={image.preview}
                                                                                alt="Blog"
                                                                                className="manage-blogs-image-preview-tiny"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="manage-blogs-action-buttons">
                    <button
                        type="button"
                        className="manage-blogs-add-btn"
                        onClick={() => append({
                            header: '',
                            description: '',
                            date: '',
                            time: '',
                            existingImages: []
                        })}
                    >
                        <MdAdd /> Add Blog
                    </button>

                    <button type="submit" className="manage-blogs-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save All Blogs'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageBlogs;