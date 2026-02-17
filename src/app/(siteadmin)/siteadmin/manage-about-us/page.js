/* Database connection. */
import dbConnect from "@/lib/db";

/* Model. */
import AboutUs from "@/models/AboutUs";

/* Components. */
import ManageAboutUs from "@/components/ManageAboutUs/ManageAboutUs";

const ManageAboutUsPage = async () => {

    let aboutUsData = {};

    try {
        await dbConnect();

        const data = await AboutUs.find({}).lean();

        data.forEach(item => {
            /* Parse JSON fields */
            if (item.key === 'bannerImages' || item.key === 'cards') {
                try {
                    aboutUsData[item.key] = {
                        value: JSON.parse(item.value),
                        updatedAt: item.updatedAt
                    };
                } catch {
                    aboutUsData[item.key] = {
                        value: item.value,
                        updatedAt: item.updatedAt
                    };
                }
            } else {
                aboutUsData[item.key] = {
                    value: item.value,
                    updatedAt: item.updatedAt
                };
            }
        });

    } catch (error) {
        console.error('Error fetching about us data:', error);
    }

    return (
        <div>
            <ManageAboutUs formData={aboutUsData} />
        </div>
    );
};

export default ManageAboutUsPage;