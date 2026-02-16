/* Components. */
import GalleryClient from "@/components/Gallery/Gallery";

/* Model. */
import Gallery from "@/models/Gallery";

/* Helpers. */
import dbConnect from "@/lib/db";

export default async function GalleryIndex() {
    await dbConnect();
    const galleryData = await Gallery.find().lean();
    const data = JSON.parse(JSON.stringify(galleryData));
    return (<GalleryClient data={data} />)
};