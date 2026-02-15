'use client';

/* Plugins. */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "nextjs-toast-notify";
import { useDispatch } from "react-redux";
import { CgTrash } from "react-icons/cg";
import { HiOutlinePhotograph } from "react-icons/hi";

/* Components. */
import CommonInputField from "../CommonInputField/CommonInputField";

/* Style. */
import './manageContactUs.css';

const ManageContactUs = (props) => {

    /* Props. */
    const { formData } = props;

    /* State management. */
    const [triangleImagePreview, setTriangleImagePreview] = useState(null);
    const [squareImagePreview, setSquareImagePreview] = useState(null);
    const [circleImagePreview, setCircleImagePreview] = useState(null);
    const [imageFiles, setImageFiles] = useState({ triangleImage: null, squareImage: null, circleImage: null });
    const [imageLoaded, setImageLoaded] = useState({ triangleImage: false, squareImage: false, circleImage: false });

    /* Hooks declarations. */
    const dispatch = useDispatch();
    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            header: '',
            description: '',
            triangleImage: '',
            squareImage: '',
            circleImage: ''
        }
    });

    /* To initialize the form values. */
    useEffect(() => {
        if (formData) {
            let customizedFormData = {};
            let isNestedStructure = formData[Object.keys(formData)[0]]?.hasOwnProperty('value');

            Object.keys(formData).forEach(key => {
                customizedFormData[key] = isNestedStructure ? (formData[key]?.value || '') : (formData[key] || '');
            });
            reset(customizedFormData);

            let triangleImageValue = isNestedStructure ? formData.triangleImage?.value : formData.triangleImage;
            let squareImageValue = isNestedStructure ? formData.squareImage?.value : formData.squareImage;
            let circleImageValue = isNestedStructure ? formData.circleImage?.value : formData.circleImage;

            if (triangleImageValue) setTriangleImagePreview(`/uploads/contactUs/${triangleImageValue}`);
            if (squareImageValue) setSquareImagePreview(`/uploads/contactUs/${squareImageValue}`);
            if (circleImageValue) setCircleImagePreview(`/uploads/contactUs/${circleImageValue}`);
        }
    }, [formData, reset]);

    /* Submit functionality. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();

            // Append text fields
            formDataToSend.append('header', data.header || '');
            formDataToSend.append('description', data.description || '');

            /* Triangle Image. */
            if (imageFiles.triangleImage) formDataToSend.append('triangleImage', imageFiles.triangleImage);
            else if (data.triangleImage) formDataToSend.append('existingTriangleImage', data.triangleImage);

            /* Square Image. */
            if (imageFiles.squareImage) formDataToSend.append('squareImage', imageFiles.squareImage);
            else if (data.squareImage) formDataToSend.append('existingSquareImage', data.squareImage);

            /* Circle Image. */
            if (imageFiles.circleImage) formDataToSend.append('circleImage', imageFiles.circleImage);
            else if (data.circleImage) formDataToSend.append('existingCircleImage', data.circleImage);

            const response = await fetch('/api/contactUs/manageContactUs', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                showToast.success('Contact Us page updated successfully!', {
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

    /* Functionality to handle images. */
    const handleImageChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast.error('Please select an image file', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Image must be less than 5MB', {
                duration: 4000,
                progress: true,
                position: "bottom-right",
                transition: "bounceIn"
            });
            return;
        }

        setImageFiles(prev => ({ ...prev, [fieldName]: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            if (fieldName === 'triangleImage') setTriangleImagePreview(reader.result);
            if (fieldName === 'squareImage') setSquareImagePreview(reader.result);
            if (fieldName === 'circleImage') setCircleImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setValue(fieldName, file.name);
    };

    /* Delete the uploaded images */
    const handleImageDelete = (fieldName) => {
        if (fieldName === 'triangleImage') setTriangleImagePreview(null);
        if (fieldName === 'squareImage') setSquareImagePreview(null);
        if (fieldName === 'circleImage') setCircleImagePreview(null);

        setImageFiles(prev => ({ ...prev, [fieldName]: null }));
        setImageLoaded(prev => ({ ...prev, [fieldName]: false }));
        setValue(fieldName, '');
    };

    /* Handle image load */
    const handleImageLoad = (fieldName) => {
        setImageLoaded(prev => ({ ...prev, [fieldName]: true }));
    };

    /* Handle image error */
    const handleImageError = (fieldName) => {
        setImageLoaded(prev => ({ ...prev, [fieldName]: false }));
    };

    return (
        <div className="manage-contact-us-container">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>

                {/* Image Upload Section */}
                <div className="contact-settings-section">
                    <div className="contact-image-grid">

                        {/* Triangle Image Upload */}
                        <div className="contact-image-upload-box">
                            <label className="contact-image-upload-label">Triangle Image</label>
                            <div className="contact-image-upload-wrapper">
                                {triangleImagePreview && (
                                    <div className="contact-image-delete-wrapper" onClick={() => handleImageDelete('triangleImage')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="contact-image-display-section">
                                    {triangleImagePreview ? (
                                        <img
                                            src={triangleImagePreview}
                                            className="contact-image-upload-style"
                                            onLoad={() => handleImageLoad('triangleImage')}
                                            onError={() => handleImageError('triangleImage')}
                                            style={{ opacity: imageLoaded.triangleImage ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Triangle"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="contact-default-image-icon" />
                                            <span className="contact-drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="contact-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="triangle-upload"
                                        onChange={(e) => handleImageChange(e, 'triangleImage')}
                                    />
                                    <label htmlFor="triangle-upload" className="contact-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Square Image Upload */}
                        <div className="contact-image-upload-box">
                            <label className="contact-image-upload-label">Square Image</label>
                            <div className="contact-image-upload-wrapper">
                                {squareImagePreview && (
                                    <div className="contact-image-delete-wrapper" onClick={() => handleImageDelete('squareImage')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="contact-image-display-section">
                                    {squareImagePreview ? (
                                        <img
                                            src={squareImagePreview}
                                            className="contact-image-upload-style"
                                            onLoad={() => handleImageLoad('squareImage')}
                                            onError={() => handleImageError('squareImage')}
                                            style={{ opacity: imageLoaded.squareImage ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Square"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="contact-default-image-icon" />
                                            <span className="contact-drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="contact-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="square-upload"
                                        onChange={(e) => handleImageChange(e, 'squareImage')}
                                    />
                                    <label htmlFor="square-upload" className="contact-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Circle Image Upload */}
                        <div className="contact-image-upload-box">
                            <label className="contact-image-upload-label">Circle Image</label>
                            <div className="contact-image-upload-wrapper">
                                {circleImagePreview && (
                                    <div className="contact-image-delete-wrapper" onClick={() => handleImageDelete('circleImage')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="contact-image-display-section">
                                    {circleImagePreview ? (
                                        <img
                                            src={circleImagePreview}
                                            className="contact-image-upload-style"
                                            onLoad={() => handleImageLoad('circleImage')}
                                            onError={() => handleImageError('circleImage')}
                                            style={{ opacity: imageLoaded.circleImage ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Circle"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="contact-default-image-icon" />
                                            <span className="contact-drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="contact-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="circle-upload"
                                        onChange={(e) => handleImageChange(e, 'circleImage')}
                                    />
                                    <label htmlFor="circle-upload" className="contact-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header and Description Section */}
                <div className="contact-settings-section">
                    <div className="contact-form-grid">
                        <div className="contact-form-group full-width">
                            <Controller
                                name="header"
                                control={control}
                                rules={{ required: 'Header is required' }}
                                render={(props) => (
                                    <CommonInputField
                                        {...props}
                                        type="text"
                                        placeholder="Enter contact us page header"
                                        label="Page Header"
                                    />
                                )}
                            />
                        </div>

                        <div className="contact-form-group full-width">
                            <label className="contact-form-label">Page Description *</label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            rows={8}
                                            placeholder="Enter contact us page description"
                                            className={`contact-form-textarea ${error ? 'error' : ''}`}
                                        />
                                        {error && <span className="contact-error-message">{error.message}</span>}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="contact-submit-section">
                    <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageContactUs;