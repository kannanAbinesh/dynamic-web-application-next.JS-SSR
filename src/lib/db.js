/* Plugins. */
import mongoose from "mongoose";

/* Variables. */
const DB_URL = process.env.DEV_DB_URL;
// const DB_URL = process.env.ENVIRONMENT === 'DEVELOPMENT' ? process.env.DEV_DB_URL : process.env.PROD_DB_URL;

export default dbConnect;

/* MongoDB connection functionality. */
async function dbConnect() {
    if(!DB_URL) throw new Error('Please define the DR_URL to run the application');

    await mongoose.connect(DB_URL);
    return mongoose;
};