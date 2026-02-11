/* Plugins. */
import Home from "@/components/Home/Home";

/* Model. */
import User from "@/models/User";

/* Helpers. */
import dbConnect from "@/lib/db";

export default async function HomeIndex() {
  await dbConnect();
  const userDetails = await User.findOne({ email: 'abineshkannan98@gmail.com', deletedAt: null });
  return (<Home user={JSON.parse(JSON.stringify(userDetails))} />);
};