'use client';

/* Plugins. */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "nextjs-toast-notify";
import Image from 'next/image';

/* Components. */
import CommonInputField from "../CommonInputField/CommonInputField";

/* Style. */
import './siteSettings.css';

const SiteSettings = (props) => {

    /* Props. */
    const { formData, onSubmit } = props;

    /* State management. */
    const [logoPreview, setLogoPreview] = useState(null);
    const [darkLogoPreview, setDarkLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [imageFiles, setImageFiles] = useState({ logo: null, darkThemeLogo: null, favicon: null });

    /* Hooks declarations. */
    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            siteName: '', poweredBy: '', siteMail: '', logo: '', darkThemeLogo: '', favicon: '', facebook: '', twitter: '',
            instagram: '', linkedin: '', youtube: '', tiktok: '', pinterest: '', whatsapp: '', mail: ''
        }
    });

    /* To intiialize the form values. */
    useEffect(() => {
        if (formData) {
            const customizedFormData = {};
            Object.keys(formData).forEach(key => { customizedFormData[key] = formData[key]?.value || '' });
            reset(customizedFormData);

            if (formData.logo?.value) setLogoPreview(`/uploads/siteSettings/${formData.logo.value}`);
            if (formData.darkThemeLogo?.value) setDarkLogoPreview(`/uploads/siteSettings/${formData.darkThemeLogo.value}`);
            if (formData.favicon?.value) setFaviconPreview(`/uploads/siteSettings/${formData.favicon.value}`);
        }
    }, [formData, reset]);

    /* Submit functionality. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();
            Object.keys(data).forEach(key => { if (['logo', 'darkThemeLogo', 'favicon']?.includes(key)) formDataToSend.append(key, data[key] || '') });

            /* Logo. */
            if (imageFiles.logo) formDataToSend.append('logo', imageFiles.logo);
            else if (data.logo) formDataToSend.append('existingLogo', data.logo);

            /* Dark theme logo. */
            if (imageFiles.darkThemeLogo) formDataToSend.append('darkThemeLogo', imageFiles.darkThemeLogo);
            else if (data.darkThemeLogo) formDataToSend.append('existingDarkThemeLogo', data.darkThemeLogo);

            /* Favicon. */
            if (imageFiles.favicon) formDataToSend.append('favicon', imageFiles.favicon);
            else if (data.favicon) formDataToSend.append('existingFavicon', data.favicon);

            if (onSubmit) await onSubmit(formDataToSend);
        } catch (error) {
            showToast.error(error, { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
            return "";
        };
    };

    /* Fucntionality to handle images. */
    const handleImageChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast.error('Please select an image file', { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
            return;
        };

        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Image to be less than 5MB', { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
            return "";
        };

        setImageFiles(prev => ({ ...prev, [fieldName]: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            if (fieldName === 'logo') setLogoPreview(reader.result);
            if (fieldName === 'darkThemeLogo') setDarkLogoPreview(reader.result);
            if (fieldName === 'favicon') setFaviconPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setValue(fieldName, file.name);
    };

    /* Delete the uploaed images */
    const handleImageDelete = (fieldName) => {
        if (fieldName === 'logo') setLogoPreview(null);
        if (fieldName === 'darkThemeLogo') setDarkLogoPreview(null);
        if (fieldName === 'favicon') setFaviconPreview(null);

        setImageFiles(prev => ({ ...prev, [fieldName]: null }));
        setValue(fieldName, '');
    };

    return (
        <div className="site-settings-container">
            <form onSubmit={handleSubmit(handleFormSubmit)}>

                {/* Image Upload Section */}
                <div className="settings-section">
                    <div className="image-grid">

                        {/* Logo Upload */}
                        <div className="image-upload-box">
                            <label className="image-label">Logo</label>
                            <div className="image-upload-area">
                                {logoPreview ? (
                                    <div className="image-preview-box">
                                        <Image
                                            src={logoPreview}
                                            alt="Logo"
                                            width={150}
                                            height={150}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <div className="image-buttons">
                                            <button type="button" className="btn-danger" onClick={() => handleImageDelete('logo')}>Delete</button>
                                            <label className="btn-primary">
                                                Change
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleImageChange(e, 'logo')}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span>Upload Logo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, 'logo')}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Dark Theme Logo Upload */}
                        <div className="image-upload-box">
                            <label className="image-label">Dark Theme Logo</label>
                            <div className="image-upload-area">
                                {darkLogoPreview ? (
                                    <div className="image-preview-box">
                                        <Image
                                            src={darkLogoPreview}
                                            alt="Dark Logo"
                                            width={150}
                                            height={150}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <div className="image-buttons">
                                            <button type="button" className="btn-danger" onClick={() => handleImageDelete('darkThemeLogo')}>Delete</button>
                                            <label className="btn-primary">
                                                Change
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleImageChange(e, 'darkThemeLogo')}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span>Upload Dark Logo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, 'darkThemeLogo')}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Favicon Upload */}
                        <div className="image-upload-box">
                            <label className="image-label">Favicon</label>
                            <div className="image-upload-area">
                                {faviconPreview ? (
                                    <div className="image-preview-box">
                                        <Image
                                            src={faviconPreview}
                                            alt="Favicon"
                                            width={150}
                                            height={150}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <div className="image-buttons">
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => handleImageDelete('favicon')}
                                            >
                                                Delete
                                            </button>
                                            <label className="btn-primary">
                                                Change
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleImageChange(e, 'favicon')}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span>Upload Favicon</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, 'favicon')}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="settings-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Site Name</label>
                            <Controller
                                name="siteName"
                                control={control}
                                rules={{ required: 'Site name is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Powered By</label>
                            <Controller
                                name="poweredBy"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links Section */}
                <div className="settings-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Mail</label>
                            <Controller
                                name="facebook"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Facebook</label>
                            <Controller
                                name="facebook"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Instagram</label>
                            <Controller
                                name="instagram"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">YouTube</label>
                            <Controller
                                name="youtube"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">WhatsApp</label>
                            <Controller
                                name="whatsapp"
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" />)}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="submit-section">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Settings'}</button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettings;