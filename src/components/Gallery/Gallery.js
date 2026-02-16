'use client';

/* Plugins. */
import { useState } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { BiZoomIn } from 'react-icons/bi';

/* Style. */
import './gallery.css';

export default function Gallery(props) {

    /* Props. */
    const { data = [] } = props;

    /* State. */
    const [selectedImage, setSelectedImage] = useState(null);

    /* Handle image click */
    const handleImageClick = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    /* Close lightbox */
    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="gallery-page-container">
            {data.length === 0 ? (
                <div className="gallery-empty-state">
                    <p>No images available in the gallery yet.</p>
                </div>
            ) : (
                <div className="gallery-content-wrapper">
                    <div className="gallery-collage-grid">
                        {data.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="gallery-collage-item"
                                onClick={() => handleImageClick(item)}
                            >
                                <div className="gallery-image-wrapper">
                                    <Image
                                        src={`/uploads/gallery/${item.image}`}
                                        alt={`Gallery image ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="gallery-image"
                                        quality={75}
                                    />
                                    <div className="gallery-zoom-icon">
                                        <BiZoomIn />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="gallery-lightbox" onClick={closeLightbox}>
                    <button className="gallery-lightbox-close" onClick={closeLightbox}>
                        <IoClose />
                    </button>
                    <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={`/uploads/gallery/${selectedImage.image}`}
                            alt="Gallery lightbox"
                            width={1200}
                            height={800}
                            className="gallery-lightbox-image"
                            quality={90}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};