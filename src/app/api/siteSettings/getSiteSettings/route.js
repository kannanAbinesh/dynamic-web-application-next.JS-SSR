/* Plugins. */
import { NextResponse } from "next/server";

/* Model. */
import SiteSetting from "@/models/SiteSettings";
import dbConnect from "@/lib/db";

export async function GET() {
    try {

        await dbConnect()

        /* Variable declarations. */
        let resultData = {};

        /* Get site settings data. */
        const siteSettingsData = await SiteSetting.find();
        siteSettingsData?.forEach(ele => { resultData[ele?.key] = ele?.value });
        
        return NextResponse.json({ data: resultData }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Something went wrong in get site settings data. Error: ${error}` }, { status: 400 }) };
};