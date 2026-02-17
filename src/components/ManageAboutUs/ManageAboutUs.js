'use client';

/* Plugins. */
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { showToast } from "nextjs-toast-notify";
import { CgTrash } from "react-icons/cg";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdAdd, MdVideoLibrary } from "react-icons/md";

/* Components. */
import CommonInputField from "../CommonInputField/CommonInputField";

/* Style. */
import './manageAboutUs.css';

const ManageAboutUs = (props) => {

    /* Props. */
    const { formData } = props;

    /* State management. */
    const [bannerImages, setBannerImages] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    /* Hooks declarations. */
    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            bannerHeader: '',
            bannerDescription: '',
            mainDescription: '',
            cards: [
                {
                    header: '',
                    description: '',
                    count: ''
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cards"
    });

    /* To initialize the form values. */
    useEffect(() => {
        if (formData) {
            let customizedFormData = {};
            let isNestedStructure = formData[Object.keys(formData)[0]]?.hasOwnProperty('value');

            ['bannerHeader', 'bannerDescription', 'mainDescription'].forEach(key => {
                customizedFormData[key] = isNestedStructure ? (formData[key]?.value || '') : (formData[key] || '');
            });

            if (formData.cards) {
                customizedFormData.cards = isNestedStructure ? formData.cards.value : formData.cards;
            }

            reset(customizedFormData);

            if (formData.bannerImages) {
                const images = isNestedStructure ? formData.bannerImages.value : formData.bannerImages;
                if (Array.isArray(images)) {
                    setBannerImages(images.map((img, idx) => ({
                        id: idx,
                        preview: `/uploads/aboutUs/${img}`,
                        isNew: false,
                        fileName: img
                    })));
                }
            }

            if (formData.video) {
                const videoName = isNestedStructure ? formData.video.value : formData.video;
                if (videoName) {
                    setVideoPreview(`/uploads/aboutUs/${videoName}`);
                }
            }
        }
    }, [formData, reset]);

    /* Handle multiple banner image upload. */
    const handleBannerImageUpload = (e) => {
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
                setBannerImages(prev => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        file: file,
                        preview: reader.result,
                        isNew: true
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    };

    /* Delete banner image. */
    const handleDeleteBannerImage = (imageId) => {
        setBannerImages(prev => prev.filter(img => img.id !== imageId));
    };

    /* Handle video upload. */
    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            showToast.error('Please select a video file', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            showToast.error('Video must be less than 50MB', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
            return;
        }

        setVideoFile(file);
        const videoURL = URL.createObjectURL(file);
        setVideoPreview(videoURL);
        setValue('video', file.name);
    };

    /* Delete video. */
    const handleDeleteVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setValue('video', '');
    };

    /* Submit functionality. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('bannerHeader', data.bannerHeader || '');
            formDataToSend.append('bannerDescription', data.bannerDescription || '');
            formDataToSend.append('mainDescription', data.mainDescription || '');

            bannerImages.forEach((image) => {
                if (image.isNew) {
                    formDataToSend.append('bannerImages', image.file);
                } else {
                    formDataToSend.append('existingBannerImages', image.fileName);
                }
            });

            if (videoFile) {
                formDataToSend.append('video', videoFile);
            } else if (videoPreview) {
                formDataToSend.append('existingVideo', videoPreview.split('/').pop());
            }

            formDataToSend.append('cards', JSON.stringify(data.cards));

            const response = await fetch('/api/siteSettings/manage-about-us', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                showToast.success('About Us page updated successfully!', {
                    duration: 4000,
                    progress: true,
                    position: "bottom-right",
                    transition: "bounceIn"
                });
            } else {
                throw new Error(result.message || 'Failed to update');
            }

        } catch (error) {
            showToast.error(error.message || 'Something went wrong', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
        }
    };

    return (
        <div className="manage-about-us-container">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>

                {/* Banner Section */}
                <div className="manage-about-us-section-card">
                    <h3 className="manage-about-us-section-card-title">Banner Section</h3>

                    {/* Banner Images Upload */}
                    <div className="manage-about-us-form-group">
                        <label className="manage-about-us-form-label">Banner Images</label>
                        <div className="manage-about-us-image-upload-compact">
                            <HiOutlinePhotograph className="manage-about-us-upload-icon-tiny" />
                            <span className="manage-about-us-upload-text-tiny">Add banner images</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                id="banner-images-upload"
                                onChange={handleBannerImageUpload}
                            />
                            <label htmlFor="banner-images-upload" className="manage-about-us-upload-btn-tiny">
                                Choose
                            </label>
                        </div>

                        {bannerImages.length > 0 && (
                            <div className="manage-about-us-images-scroll">
                                {bannerImages.map((image) => (
                                    <div key={image.id} className="manage-about-us-image-thumb">
                                        <div
                                            className="manage-about-us-image-delete-tiny"
                                            onClick={() => handleDeleteBannerImage(image.id)}
                                        >
                                            <CgTrash />
                                        </div>
                                        <img
                                            src={image.preview}
                                            alt="Banner"
                                            className="manage-about-us-image-preview-tiny"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Banner Header */}
                    <div className="manage-about-us-form-group">
                        <Controller
                            name="bannerHeader"
                            control={control}
                            rules={{ required: 'Banner header is required' }}
                            render={(props) => (
                                <CommonInputField
                                    {...props}
                                    type="text"
                                    placeholder="Enter banner header"
                                    label="Banner Header"
                                />
                            )}
                        />
                    </div>

                    {/* Banner Description */}
                    <div className="manage-about-us-form-group">
                        <label className="manage-about-us-form-label">Banner Description *</label>
                        <Controller
                            name="bannerDescription"
                            control={control}
                            rules={{ required: 'Banner description is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <textarea
                                        {...field}
                                        rows={3}
                                        placeholder="Enter banner description"
                                        className={`manage-about-us-form-textarea ${error ? 'manage-about-us-error' : ''}`}
                                    />
                                    {error && <span className="manage-about-us-error-message">{error.message}</span>}
                                </>
                            )}
                        />
                    </div>

                    {/* Video Upload */}
                    <div className="manage-about-us-form-group">
                        <label className="manage-about-us-form-label">Banner Video</label>
                        <div className="manage-about-us-video-upload-section">
                            {videoPreview ? (
                                <div className="manage-about-us-video-preview-wrapper">
                                    <div
                                        className="manage-about-us-video-delete"
                                        onClick={handleDeleteVideo}
                                    >
                                        <CgTrash />
                                    </div>
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="manage-about-us-video-preview"
                                    />
                                </div>
                            ) : (
                                <div className="manage-about-us-video-upload-placeholder">
                                    <MdVideoLibrary className="manage-about-us-video-icon" />
                                    <span className="manage-about-us-video-text">Upload banner video</span>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        id="video-upload"
                                        onChange={handleVideoUpload}
                                    />
                                    <label htmlFor="video-upload" className="manage-about-us-video-upload-btn">
                                        Choose Video
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Description Section */}
                <div className="manage-about-us-section-card">
                    <h3 className="manage-about-us-section-card-title">Main Content</h3>

                    <div className="manage-about-us-form-group">
                        <label className="manage-about-us-form-label">Main Description *</label>
                        <Controller
                            name="mainDescription"
                            control={control}
                            rules={{ required: 'Main description is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <textarea
                                        {...field}
                                        rows={8}
                                        placeholder="Enter main description"
                                        className={`manage-about-us-form-textarea ${error ? 'manage-about-us-error' : ''}`}
                                    />
                                    {error && <span className="manage-about-us-error-message">{error.message}</span>}
                                </>
                            )}
                        />
                    </div>
                </div>

                {/* Cards Section */}
                <div className="manage-about-us-section-card">
                    <div className="manage-about-us-cards-header">
                        <h3 className="manage-about-us-section-card-title">Feature Cards</h3>
                        <button
                            type="button"
                            className="manage-about-us-add-card-btn"
                            onClick={() => append({
                                header: '',
                                description: '',
                                count: ''
                            })}
                        >
                            <MdAdd />
                        </button>
                    </div>

                    <div className="manage-about-us-cards-grid">
                        {fields.map((field, index) => (
                            <div key={field.id} className="manage-about-us-card-item">
                                <div className="manage-about-us-card-header">
                                    <h4 className="manage-about-us-card-number">Card #{index + 1}</h4>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            className="manage-about-us-remove-card-btn"
                                            onClick={() => remove(index)}
                                        >
                                            <CgTrash />
                                        </button>
                                    )}
                                </div>

                                <div className="manage-about-us-card-content">
                                    <div className="manage-about-us-form-group">
                                        <label className="manage-about-us-form-label">Card Header *</label>
                                        <Controller
                                            name={`cards.${index}.header`}
                                            control={control}
                                            rules={{ required: 'Card header is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter card header"
                                                        className={`manage-about-us-form-input ${error ? 'manage-about-us-error' : ''}`}
                                                    />
                                                    {error && <span className="manage-about-us-error-message">{error.message}</span>}
                                                </>
                                            )}
                                        />
                                    </div>

                                    <div className="manage-about-us-form-group">
                                        <label className="manage-about-us-form-label">Card Description *</label>
                                        <Controller
                                            name={`cards.${index}.description`}
                                            control={control}
                                            rules={{ required: 'Card description is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <textarea
                                                        {...field}
                                                        rows={3}
                                                        placeholder="Enter card description"
                                                        className={`manage-about-us-form-textarea ${error ? 'manage-about-us-error' : ''}`}
                                                    />
                                                    {error && <span className="manage-about-us-error-message">{error.message}</span>}
                                                </>
                                            )}
                                        />
                                    </div>

                                    <div className="manage-about-us-form-group">
                                        <label className="manage-about-us-form-label">Count *</label>
                                        <Controller
                                            name={`cards.${index}.count`}
                                            control={control}
                                            rules={{ required: 'Count is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter count (e.g., 100+)"
                                                        className={`manage-about-us-form-input ${error ? 'manage-about-us-error' : ''}`}
                                                    />
                                                    {error && <span className="manage-about-us-error-message">{error.message}</span>}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="manage-about-us-submit-section">
                    <button type="submit" className="manage-about-us-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageAboutUs;