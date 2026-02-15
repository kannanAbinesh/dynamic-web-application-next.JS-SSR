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

/* Helpers. */
import { fetchSiteSettings } from "@/reducers";

/* Style. */
import './siteSettings.css';

const SiteSettings = (props) => {

    /* Props. */
    const { formData } = props;

    /* State management. */
    const [logoPreview, setLogoPreview] = useState(null);
    const [darkLogoPreview, setDarkLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [imageFiles, setImageFiles] = useState({ logo: null, darkThemeLogo: null, favicon: null });
    const [imageLoaded, setImageLoaded] = useState({ logo: false, darkThemeLogo: false, favicon: false });

    /* Hooks declarations. */
    const dispatch = useDispatch();
    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            siteName: '', poweredBy: '', siteMail: '', logo: '', darkThemeLogo: '', favicon: '', facebook: '', twitter: '',
            instagram: '', linkedin: '', youtube: '', tiktok: '', pinterest: '', whatsapp: '', mail: ''
        }
    });

    /* To initialize the form values. */
    useEffect(() => {
        if (formData) {

            let customizedFormData = {};
            let isNestedStructure = formData[Object.keys(formData)[0]]?.hasOwnProperty('value');

            Object.keys(formData).forEach(key => { customizedFormData[key] = isNestedStructure ? (formData[key]?.value || '') : (formData[key] || '') });
            reset(customizedFormData);

            let logoValue = isNestedStructure ? formData.logo?.value : formData.logo;
            let darkLogoValue = isNestedStructure ? formData.darkThemeLogo?.value : formData.darkThemeLogo;
            let faviconValue = isNestedStructure ? formData.favicon?.value : formData.favicon;

            if (logoValue) setLogoPreview(`/uploads/siteSettings/${logoValue}`);
            if (darkLogoValue) setDarkLogoPreview(`/uploads/siteSettings/${darkLogoValue}`);
            if (faviconValue) setFaviconPreview(`/uploads/siteSettings/${faviconValue}`);
        };
    }, [formData, reset]);

    /* Submit functionality. */
    const handleFormSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();

            Object.keys(data).forEach(key => {
                if (!['logo', 'darkThemeLogo', 'favicon'].includes(key)) formDataToSend.append(key, data[key] || '');
            });

            /* Logo. */
            if (imageFiles.logo) formDataToSend.append('logo', imageFiles.logo);
            else if (data.logo) formDataToSend.append('existingLogo', data.logo);

            /* Dark theme logo. */
            if (imageFiles.darkThemeLogo) formDataToSend.append('darkThemeLogo', imageFiles.darkThemeLogo);
            else if (data.darkThemeLogo) formDataToSend.append('existingDarkThemeLogo', data.darkThemeLogo);

            /* Favicon. */
            if (imageFiles.favicon) formDataToSend.append('favicon', imageFiles.favicon);
            else if (data.favicon) formDataToSend.append('existingFavicon', data.favicon);

            const response = await fetch('/api/siteSettings/manageSiteSettings', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response?.status) {
                showToast.success('Settings updated successfully!', { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
                dispatch(fetchSiteSettings());
            };

        } catch (error) { showToast.error(error.message, { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" }) };
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
            if (fieldName === 'logo') setLogoPreview(reader.result);
            if (fieldName === 'darkThemeLogo') setDarkLogoPreview(reader.result);
            if (fieldName === 'favicon') setFaviconPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setValue(fieldName, file.name);
    };

    /* Delete the uploaded images */
    const handleImageDelete = (fieldName) => {
        if (fieldName === 'logo') setLogoPreview(null);
        if (fieldName === 'darkThemeLogo') setDarkLogoPreview(null);
        if (fieldName === 'favicon') setFaviconPreview(null);

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
        <div className="site-settings-container">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>

                {/* Image Upload Section */}
                <div className="settings-section">
                    <div className="image-grid">

                        {/* Logo Upload */}
                        <div className="image-upload-box">
                            <label className="common-image-upload-label">Logo</label>
                            <div className="common-image-upload-wrapper">
                                {logoPreview && (
                                    <div className="common-site-settings-delete-wrapper" onClick={() => handleImageDelete('logo')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="image-display-section">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            className="common-image-upload-style"
                                            onLoad={() => handleImageLoad('logo')}
                                            onError={() => handleImageError('logo')}
                                            style={{ opacity: imageLoaded.logo ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Logo"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="default-image-icon" />
                                            <span className="drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="common-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="logo-upload"
                                        onChange={(e) => handleImageChange(e, 'logo')}
                                    />
                                    <label htmlFor="logo-upload" className="common-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Dark Theme Logo Upload */}
                        <div className="image-upload-box">
                            <label className="common-image-upload-label">Dark Theme Logo</label>
                            <div className="common-image-upload-wrapper">
                                {darkLogoPreview && (
                                    <div className="common-site-settings-delete-wrapper" onClick={() => handleImageDelete('darkThemeLogo')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="image-display-section">
                                    {darkLogoPreview ? (
                                        <img
                                            src={darkLogoPreview}
                                            className="common-image-upload-style"
                                            onLoad={() => handleImageLoad('darkThemeLogo')}
                                            onError={() => handleImageError('darkThemeLogo')}
                                            style={{ opacity: imageLoaded.darkThemeLogo ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Dark Logo"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="default-image-icon" />
                                            <span className="drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="common-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="darkLogo-upload"
                                        onChange={(e) => handleImageChange(e, 'darkThemeLogo')}
                                    />
                                    <label htmlFor="darkLogo-upload" className="common-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Favicon Upload */}
                        <div className="image-upload-box">
                            <label className="common-image-upload-label">Favicon</label>
                            <div className="common-image-upload-wrapper">
                                {faviconPreview && (
                                    <div className="common-site-settings-delete-wrapper" onClick={() => handleImageDelete('favicon')}>
                                        <CgTrash color="#ffffff" />
                                    </div>
                                )}

                                <div className="image-display-section">
                                    {faviconPreview ? (
                                        <img
                                            src={faviconPreview}
                                            className="common-image-upload-style"
                                            onLoad={() => handleImageLoad('favicon')}
                                            onError={() => handleImageError('favicon')}
                                            style={{ opacity: imageLoaded.favicon ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                                            alt="Favicon"
                                        />
                                    ) : (
                                        <>
                                            <HiOutlinePhotograph className="default-image-icon" />
                                            <span className="drag-drop-text">Drag and drop the image</span>
                                        </>
                                    )}
                                </div>

                                <div className="common-image-upload-section">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="favicon-upload"
                                        onChange={(e) => handleImageChange(e, 'favicon')}
                                    />
                                    <label htmlFor="favicon-upload" className="common-image-upload-inner-content">
                                        Click here to upload
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="settings-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <Controller
                                name="siteName"
                                control={control}
                                rules={{ required: 'Site name is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter site name" label="Site Name" />)}
                            />
                        </div>

                        <div className="form-group">
                            <Controller
                                name="poweredBy"
                                control={control}
                                rules={{ required: 'PoweredBy is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter powered by" label="Powered By" />)}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links Section */}
                <div className="settings-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <Controller
                                name="mail"
                                control={control}
                                rules={{ required: 'Mail is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter mail" label="Mail" />)}
                            />
                        </div>

                        <div className="form-group">
                            <Controller
                                name="facebook"
                                rules={{ required: 'Facebook is required' }}
                                control={control}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter facebook URL" label="Facebook" />)}
                            />
                        </div>

                        <div className="form-group">
                            <Controller
                                name="instagram"
                                control={control}
                                rules={{ required: 'Instagram is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter instagram URL" label="Instagram" />)}
                            />
                        </div>

                        <div className="form-group">
                            <Controller
                                name="youtube"
                                control={control}
                                rules={{ required: 'Youtube is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter youtube URL" label="YouTube" />)}
                            />
                        </div>

                        <div className="form-group">
                            <Controller
                                name="whatsapp"
                                control={control}
                                rules={{ required: 'Whatsapp is required' }}
                                render={(props) => (<CommonInputField {...props} type="text" placeholder="Enter whatsapp" label="WhatsApp" />)}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="submit-section">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettings;