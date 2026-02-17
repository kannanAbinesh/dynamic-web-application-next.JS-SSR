/* Database connection. */
import dbConnect from "@/lib/db";

/* Model. */
import Home from "@/models/Home";

/* Components. */
import HomeClient from "@/components/Home/Home";

const HomePage = async () => {

    let homeData = {};

    try {
        await dbConnect();

        const data = await Home.find({}).lean();
        const jsonFields = ['heroImages', 'welcomeImages', 'heroSlides', 'features', 'rooms', 'testimonials'];

        data.forEach(item => {
            if (jsonFields.includes(item.key)) {
                try {
                    homeData[item.key] = {
                        value: JSON.parse(item.value),
                        updatedAt: item.updatedAt
                    };
                } catch {
                    homeData[item.key] = { value: item.value, updatedAt: item.updatedAt };
                }
            } else {
                homeData[item.key] = { value: item.value, updatedAt: item.updatedAt };
            }
        });

    } catch (error) {
        console.error('Error fetching home data:', error);
    }

    return <HomeClient formData={homeData} />;
};

export default HomePage;