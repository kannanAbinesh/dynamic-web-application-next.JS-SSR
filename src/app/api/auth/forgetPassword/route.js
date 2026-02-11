/* Plugins. */
import { NextResponse } from "next/server";

/* Models. */
import User from "@/models/User";

export async function forgetPassword(req) {
    try {

        /* Variables. */
        const { email } = req?.body;

        /* Validate the required data is provided. */
        if(!email) return NextResponse.json({ message: "Please provide your email to proceed" });

    } catch (error) { return NextResponse.json({ message: `Something went wrong in the making forget password query. Error: ${error}` }) };
};