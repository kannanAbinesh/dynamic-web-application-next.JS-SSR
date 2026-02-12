/* Plugins. */
import { NextResponse } from "next/server";

/* Model. */
import Queries from "@/models/Queries";

export default async function POST(req) {
    try {

        /* Variables. */
        const body = await req.json().catch(() => ({}));
        const { name, email, message } = body;

        /* Insert queries. */
        const queriesData = await new Queries({ name, email, message });
        await queriesData.save();

        return NextResponse.json({ message: 'Queries send. will get back to you soon' }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Something went wrong in sending your queries. Error: ${error}` }, { status: 400 }) }
};