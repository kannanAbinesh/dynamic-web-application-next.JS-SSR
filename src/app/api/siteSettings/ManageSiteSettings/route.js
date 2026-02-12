/* Plugins. */
import { NextResponse } from "next/server";

/* Model. */
import SiteSetting from "@/models/SiteSettings";

export default async function POST(req) {
    try {

        /* Variables. */
        const body = await req.json().catch(() => ({}));

    } catch (error) { return NextResponse.json({ message: `Something went wrong in managing site settings data. Error: ${error}` }, { status: 400 }) };
}