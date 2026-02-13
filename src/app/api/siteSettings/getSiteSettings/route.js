/* Plugins. */
import { NextResponse } from "next/server";

/* Model. */
import SiteSetting from "@/models/SiteSettings";

export async function GET() {
    try {

        /* Variable declarations. */
        let resultData = {};

        /* Get site settings data. */
        const siteSettingsData = await SiteSetting.find();
        siteSettingsData?.forEach(ele => { resultData[ele?.key] = ele?.value });
        
        return NextResponse.json({ data: resultData }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Something went wrong in get site settings data. Error: ${error}` }, { status: 400 }) };
};