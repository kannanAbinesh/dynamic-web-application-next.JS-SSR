'use client';

/* Plugins. */
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { showToast } from "nextjs-toast-notify";
import { CgTrash } from "react-icons/cg";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdAdd } from "react-icons/md";

/* Style. */
import './manageHome.css';

const ManageHome = ({ formData = {} }) => {

    /* ── Image States ── */
    const [heroImages, setHeroImages] = useState([]);
    const [welcomeImages, setWelcomeImages] = useState([]);
    const [ctaImageState, setCtaImageState] = useState({ preview: null, file: null, existing: '' });

    const getValue = (key, fallback = '') => formData?.[key]?.value ?? fallback;

    /* ── Form Setup ── */
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            heroTitle: '',
            heroSubtitle: '',
            welcomeTag: '',
            welcomeTitle: '',
            welcomeDescription: '',
            featuresTag: '',
            featuresTitle: '',
            featuresSubtitle: '',
            features: [{ title: '', description: '' }],
            roomsTag: '',
            roomsTitle: '',
            roomsSubtitle: '',
            rooms: [{ title: '', description: '', price: '' }],
            testimonialsTag: '',
            testimonialsTitle: '',
            testimonials: [{ text: '', name: '', role: '', stars: '5' }],
            ctaTitle: '',
            ctaText: '',
            ctaButtonText: '',
        }
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: 'features' });
    const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: 'rooms' });
    const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: 'testimonials' });

    /* ── Populate form from DB data ── */
    useEffect(() => {
        if (!formData || Object.keys(formData).length === 0) return;

        reset({
            heroTitle: getValue('heroTitle'),
            heroSubtitle: getValue('heroSubtitle'),
            welcomeTag: getValue('welcomeTag'),
            welcomeTitle: getValue('welcomeTitle'),
            welcomeDescription: getValue('welcomeDescription'),
            featuresTag: getValue('featuresTag'),
            featuresTitle: getValue('featuresTitle'),
            featuresSubtitle: getValue('featuresSubtitle'),
            features: Array.isArray(getValue('features', null)) ? getValue('features', null) : [{ title: '', description: '' }],
            roomsTag: getValue('roomsTag'),
            roomsTitle: getValue('roomsTitle'),
            roomsSubtitle: getValue('roomsSubtitle'),
            rooms: Array.isArray(getValue('rooms', null)) ? getValue('rooms', null) : [{ title: '', description: '', price: '' }],
            testimonialsTag: getValue('testimonialsTag'),
            testimonialsTitle: getValue('testimonialsTitle'),
            testimonials: Array.isArray(getValue('testimonials', null)) ? getValue('testimonials', null) : [{ text: '', name: '', role: '', stars: '5' }],
            ctaTitle: getValue('ctaTitle'),
            ctaText: getValue('ctaText'),
            ctaButtonText: getValue('ctaButtonText'),
        });

        /* Hero images */
        const heroImgs = getValue('heroImages', []);
        if (Array.isArray(heroImgs) && heroImgs.length > 0) {
            setHeroImages(heroImgs.map((img, i) => ({ id: i, preview: `/uploads/home/${img}`, isNew: false, fileName: img })));
        }

        /* Welcome images */
        const welcomeImgs = getValue('welcomeImages', []);
        if (Array.isArray(welcomeImgs) && welcomeImgs.length > 0) {
            setWelcomeImages(welcomeImgs.map((img, i) => ({ id: i, preview: `/uploads/home/${img}`, isNew: false, fileName: img })));
        }

        /* CTA image */
        const ctaImg = getValue('ctaImage');
        if (ctaImg) {
            setCtaImageState({ preview: `/uploads/home/${ctaImg}`, file: null, existing: ctaImg });
        }

    }, [formData]);

    /* ── Image Helpers ── */
    const handleMultiImageUpload = (e, setter, prefix) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        files.forEach(file => {
            if (!file.type.startsWith('image/')) return showToast.error(`${file.name} is not a valid image`, { duration: 3000, position: "bottom-right" });
            if (file.size > 5 * 1024 * 1024) return showToast.error(`${file.name} exceeds 5MB`, { duration: 3000, position: "bottom-right" });
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(prev => [...prev, { id: Date.now() + Math.random(), file, preview: reader.result, isNew: true }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleDeleteImage = (id, setter) => setter(prev => prev.filter(img => img.id !== id));

    const handleSingleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => setCtaImageState({ preview: reader.result, file, existing: '' });
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    /* ── Submit ── */
    const handleFormSubmit = async (data) => {
        try {
            const fd = new FormData();

            /* Text fields */
            const textFields = ['heroTitle', 'heroSubtitle', 'welcomeTag', 'welcomeTitle', 'welcomeDescription', 'featuresTag', 'featuresTitle', 'featuresSubtitle', 'roomsTag', 'roomsTitle', 'roomsSubtitle', 'testimonialsTag', 'testimonialsTitle', 'ctaTitle', 'ctaText', 'ctaButtonText'];
            textFields.forEach(f => fd.append(f, data[f] || ''));

            /* JSON fields */
            fd.append('features', JSON.stringify(data.features));
            fd.append('rooms', JSON.stringify(data.rooms));
            fd.append('testimonials', JSON.stringify(data.testimonials));

            /* Hero images */
            heroImages.forEach(img => {
                if (img.isNew) fd.append('heroImages', img.file);
                else fd.append('existingHeroImages', img.fileName);
            });

            /* Welcome images */
            welcomeImages.forEach(img => {
                if (img.isNew) fd.append('welcomeImages', img.file);
                else fd.append('existingWelcomeImages', img.fileName);
            });

            /* CTA image */
            if (ctaImageState.file) fd.append('ctaImage', ctaImageState.file);
            else if (ctaImageState.existing) fd.append('existingCtaImage', ctaImageState.existing);

            const response = await fetch('/api/siteSettings/manage-home', { method: 'POST', body: fd });
            const result = await response.json();

            if (result.success) {
                showToast.success('Home page updated successfully!', { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
            } else {
                throw new Error(result.message || 'Failed to update');
            }
        } catch (error) {
            showToast.error(error.message || 'Something went wrong', { duration: 4000, progress: true, position: "bottom-right", transition: "bounceIn" });
        }
    };

    /* ── Reusable sub-components ── */
    const SectionCard = ({ title, children }) => (
        <div className="manage-home-section-card">
            <h3 className="manage-home-section-title">{title}</h3>
            {children}
        </div>
    );

    const FormGroup = ({ label, children }) => (
        <div className="manage-home-form-group">
            {label && <label className="manage-home-form-label">{label}</label>}
            {children}
        </div>
    );

    const TextField = ({ name, placeholder, label, rules = {} }) => (
        <FormGroup label={label}>
            <Controller name={name} control={control} rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <input {...field} type="text" placeholder={placeholder}
                            className={`manage-home-input ${error ? 'manage-home-input-error' : ''}`} />
                        {error && <span className="manage-home-error">{error.message}</span>}
                    </>
                )}
            />
        </FormGroup>
    );

    const TextareaField = ({ name, placeholder, label, rows = 4, rules = {} }) => (
        <FormGroup label={label}>
            <Controller name={name} control={control} rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <textarea {...field} rows={rows} placeholder={placeholder}
                            className={`manage-home-textarea ${error ? 'manage-home-input-error' : ''}`} />
                        {error && <span className="manage-home-error">{error.message}</span>}
                    </>
                )}
            />
        </FormGroup>
    );

    const ImageUploadStrip = ({ images, setter, inputId, label }) => (
        <FormGroup label={label}>
            <div className="manage-home-upload-strip">
                <HiOutlinePhotograph className="manage-home-upload-icon" />
                <span className="manage-home-upload-text">Add images</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                    id={inputId} onChange={(e) => handleMultiImageUpload(e, setter)} />
                <label htmlFor={inputId} className="manage-home-upload-btn">Choose</label>
            </div>
            {images.length > 0 && (
                <div className="manage-home-images-scroll">
                    {images.map(img => (
                        <div key={img.id} className="manage-home-thumb">
                            <div className="manage-home-thumb-delete" onClick={() => handleDeleteImage(img.id, setter)}>
                                <CgTrash />
                            </div>
                            <img src={img.preview} alt="" className="manage-home-thumb-img" />
                        </div>
                    ))}
                </div>
            )}
        </FormGroup>
    );

    return (
        <div className="manage-home-container">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>

                {/* ── HERO SECTION ── */}
                <SectionCard title="Hero Slider">
                    <ImageUploadStrip images={heroImages} setter={setHeroImages} inputId="hero-images" label="Slider Background Images" />
                    <div className="manage-home-row">
                        <TextField name="heroTitle" label="Slide Title" placeholder="e.g. Luxury Redefined" />
                        <TextField name="heroSubtitle" label="Slide Subtitle" placeholder="e.g. Experience unparalleled elegance" />
                    </div>
                </SectionCard>

                {/* ── WELCOME SECTION ── */}
                <SectionCard title="Welcome Section">
                    <ImageUploadStrip images={welcomeImages} setter={setWelcomeImages} inputId="welcome-images" label="Welcome Images (2 recommended)" />
                    <div className="manage-home-row">
                        <TextField name="welcomeTag" label="Section Tag" placeholder="e.g. Welcome To Our Hotel" />
                        <TextField name="welcomeTitle" label="Section Title" placeholder="e.g. Experience the finest luxury" />
                    </div>
                    <TextareaField name="welcomeDescription" label="Description" placeholder="Enter welcome description..." rows={5} />
                </SectionCard>

                {/* ── FEATURES SECTION ── */}
                <SectionCard title="Features / Why Choose Us">
                    <div className="manage-home-row">
                        <TextField name="featuresTag" label="Section Tag" placeholder="e.g. Our Excellence" />
                        <TextField name="featuresTitle" label="Section Title" placeholder="e.g. Why Choose Us" />
                    </div>
                    <TextareaField name="featuresSubtitle" label="Section Subtitle" placeholder="Enter features subtitle..." rows={2} />
                    <div className="manage-home-array-header">
                        <label className="manage-home-form-label">Feature Cards</label>
                        <button type="button" className="manage-home-add-btn" onClick={() => appendFeature({ title: '', description: '' })}>
                            <MdAdd /> Add Feature
                        </button>
                    </div>
                    <div className="manage-home-cards-grid">
                        {featureFields.map((field, index) => (
                            <div key={field.id} className="manage-home-array-card">
                                <div className="manage-home-array-card-header">
                                    <span className="manage-home-array-card-label">Feature #{index + 1}</span>
                                    {featureFields.length > 1 && (
                                        <button type="button" className="manage-home-remove-btn" onClick={() => removeFeature(index)}>
                                            <CgTrash />
                                        </button>
                                    )}
                                </div>
                                <Controller name={`features.${index}.title`} control={control} rules={{ required: 'Required' }}
                                    render={({ field, fieldState: { error } }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Title</label>
                                            <input {...field} type="text" placeholder="Feature title"
                                                className={`manage-home-input ${error ? 'manage-home-input-error' : ''}`} />
                                        </div>
                                    )} />
                                <Controller name={`features.${index}.description`} control={control} rules={{ required: 'Required' }}
                                    render={({ field, fieldState: { error } }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Description</label>
                                            <textarea {...field} rows={3} placeholder="Feature description"
                                                className={`manage-home-textarea ${error ? 'manage-home-input-error' : ''}`} />
                                        </div>
                                    )} />
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── ROOMS SECTION ── */}
                <SectionCard title="Rooms / Suites">
                    <div className="manage-home-row">
                        <TextField name="roomsTag" label="Section Tag" placeholder="e.g. Accommodations" />
                        <TextField name="roomsTitle" label="Section Title" placeholder="e.g. Our Signature Suites" />
                    </div>
                    <TextareaField name="roomsSubtitle" label="Section Subtitle" placeholder="Enter rooms subtitle..." rows={2} />
                    <div className="manage-home-array-header">
                        <label className="manage-home-form-label">Room Cards</label>
                        <button type="button" className="manage-home-add-btn" onClick={() => appendRoom({ title: '', description: '', price: '' })}>
                            <MdAdd /> Add Room
                        </button>
                    </div>
                    <div className="manage-home-cards-grid">
                        {roomFields.map((field, index) => (
                            <div key={field.id} className="manage-home-array-card">
                                <div className="manage-home-array-card-header">
                                    <span className="manage-home-array-card-label">Room #{index + 1}</span>
                                    {roomFields.length > 1 && (
                                        <button type="button" className="manage-home-remove-btn" onClick={() => removeRoom(index)}>
                                            <CgTrash />
                                        </button>
                                    )}
                                </div>
                                <Controller name={`rooms.${index}.title`} control={control} rules={{ required: 'Required' }}
                                    render={({ field, fieldState: { error } }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Room Title</label>
                                            <input {...field} type="text" placeholder="e.g. Deluxe Room"
                                                className={`manage-home-input ${error ? 'manage-home-input-error' : ''}`} />
                                        </div>
                                    )} />
                                <Controller name={`rooms.${index}.price`} control={control}
                                    render={({ field }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Price Badge</label>
                                            <input {...field} type="text" placeholder="e.g. From $299/night"
                                                className="manage-home-input" />
                                        </div>
                                    )} />
                                <Controller name={`rooms.${index}.description`} control={control}
                                    render={({ field }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Description</label>
                                            <textarea {...field} rows={3} placeholder="Room description"
                                                className="manage-home-textarea" />
                                        </div>
                                    )} />
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── TESTIMONIALS SECTION ── */}
                <SectionCard title="Testimonials">
                    <div className="manage-home-row">
                        <TextField name="testimonialsTag" label="Section Tag" placeholder="e.g. Guest Reviews" />
                        <TextField name="testimonialsTitle" label="Section Title" placeholder="e.g. What Our Guests Say" />
                    </div>
                    <div className="manage-home-array-header">
                        <label className="manage-home-form-label">Testimonial Cards</label>
                        <button type="button" className="manage-home-add-btn" onClick={() => appendTestimonial({ text: '', name: '', role: '', stars: '5' })}>
                            <MdAdd /> Add Testimonial
                        </button>
                    </div>
                    <div className="manage-home-cards-grid">
                        {testimonialFields.map((field, index) => (
                            <div key={field.id} className="manage-home-array-card">
                                <div className="manage-home-array-card-header">
                                    <span className="manage-home-array-card-label">Testimonial #{index + 1}</span>
                                    {testimonialFields.length > 1 && (
                                        <button type="button" className="manage-home-remove-btn" onClick={() => removeTestimonial(index)}>
                                            <CgTrash />
                                        </button>
                                    )}
                                </div>
                                <Controller name={`testimonials.${index}.text`} control={control}
                                    render={({ field }) => (
                                        <div className="manage-home-form-group">
                                            <label className="manage-home-form-label">Review Text</label>
                                            <textarea {...field} rows={3} placeholder="Guest review..."
                                                className="manage-home-textarea" />
                                        </div>
                                    )} />
                                <div className="manage-home-row">
                                    <Controller name={`testimonials.${index}.name`} control={control}
                                        render={({ field }) => (
                                            <div className="manage-home-form-group">
                                                <label className="manage-home-form-label">Guest Name</label>
                                                <input {...field} type="text" placeholder="e.g. Sarah Johnson"
                                                    className="manage-home-input" />
                                            </div>
                                        )} />
                                    <Controller name={`testimonials.${index}.role`} control={control}
                                        render={({ field }) => (
                                            <div className="manage-home-form-group">
                                                <label className="manage-home-form-label">Role</label>
                                                <input {...field} type="text" placeholder="e.g. Verified Guest"
                                                    className="manage-home-input" />
                                            </div>
                                        )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── CTA SECTION ── */}
                <SectionCard title="Call To Action Section">
                    <FormGroup label="CTA Background Image">
                        <div className="manage-home-cta-image-wrapper">
                            {ctaImageState.preview ? (
                                <div className="manage-home-cta-preview">
                                    <img src={ctaImageState.preview} alt="CTA" className="manage-home-cta-img" />
                                    <button type="button" className="manage-home-cta-delete"
                                        onClick={() => setCtaImageState({ preview: null, file: null, existing: '' })}>
                                        <CgTrash />
                                    </button>
                                </div>
                            ) : (
                                <div className="manage-home-upload-strip">
                                    <HiOutlinePhotograph className="manage-home-upload-icon" />
                                    <span className="manage-home-upload-text">CTA background image</span>
                                    <input type="file" accept="image/*" style={{ display: 'none' }}
                                        id="cta-image" onChange={handleSingleImageUpload} />
                                    <label htmlFor="cta-image" className="manage-home-upload-btn">Choose</label>
                                </div>
                            )}
                        </div>
                    </FormGroup>
                    <div className="manage-home-row">
                        <TextField name="ctaTitle" label="CTA Title" placeholder="e.g. Ready to Experience Luxury?" />
                        <TextField name="ctaButtonText" label="Button Text" placeholder="e.g. Reserve Your Room" />
                    </div>
                    <TextareaField name="ctaText" label="CTA Description" placeholder="Enter CTA description..." rows={3} />
                </SectionCard>

                {/* ── SUBMIT ── */}
                <div className="manage-home-submit-row">
                    <button type="submit" className="manage-home-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Home Page'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ManageHome;