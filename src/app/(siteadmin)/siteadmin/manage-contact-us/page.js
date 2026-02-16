/* Database connection. */

/* Model. */

/* Components. */
import ManageContactUs from "@/components/ManageContactUs/ManageContactUs";
import dbConnect from "@/lib/db";
import ContactUs from "@/models/ContactUs";

const ManageContactUsPage = async () => {
    
    let contactUsData = {};

    try {
        await dbConnect();
        
        const data = await ContactUs.find({}).lean();
        
        data.forEach(item => {
            contactUsData[item.key] = {
                value: item.value,
                updatedAt: item.updatedAt
            };
        });

    } catch (error) {
        console.error('Error fetching contact us data:', error);
    }

    return (
        <div>
            <ManageContactUs formData={contactUsData} />
        </div>
    );
};

export default ManageContactUsPage;