/* Plugins. */
import { NextResponse } from "next/server";

/* Models. */
import Queries from "@/models/Queries";

export default async function GET(req) {
    try {

        /* Variables. */
        const body = req.json().catch(() => { });

        /* Get queries. */
        const queriesData = await Queries.find();

        return NextResponse.json({ data: queriesData }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Something went wring in retriving the queries. Error: ${error}` }) };
};