/* Plugins. */
import AboutUs from "@/components/AboutUs/AboutUs";

/* Model. */
import User from "@/models/User";

/* Helpers. */
import dbConnect from "@/lib/db";

export default async function AboutusIndex() {
    await dbConnect();
    const userDetails = await User.findOne({ email: 'abineshkannan98@gmail.com', deletedAt: null });
    return (<AboutUs />)
};