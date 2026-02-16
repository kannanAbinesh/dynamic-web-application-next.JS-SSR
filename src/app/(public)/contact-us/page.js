/* Components. */
import ContactUsClient from "@/components/ContactUs/ContactUs";
import dbConnect from "@/lib/db";
import ContactUs from "@/models/ContactUs";

const ContactUsIndex = async () => {
    
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
            <ContactUsClient data={contactUsData} />
        </div>
    );
};

export default ContactUsIndex;