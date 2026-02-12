import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Ensure this path is correct
import Queries from "@/models/Queries";

export async function POST(req) {
    try {
        // 1. MUST connect to the database first
        await dbConnect();

        // 2. Parse the body
        const body = await req.json().catch(() => ({}));
        const { name, email, message } = body;

        // 3. Simple validation check
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "All fields (name, email, message) are required." }, 
                { status: 400 }
            );
        }

        // 4. Create and Save using the model
        const newQuery = new Queries({ name, email, message });
        await newQuery.save();

        return NextResponse.json(
            { message: 'Queries sent. We will get back to you soon!' }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { message: `Error: ${error.message || "Internal Server Error"}` }, 
            { status: 500 }
        );
    }
}