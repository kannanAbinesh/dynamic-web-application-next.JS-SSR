/* Plugins. */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* Models. */
import User from "@/models/User";
import Login from "@/models/Login";

/* Helpers. */
import dbConnect from "@/lib/db";

export async function POST(req) {
    try {

        await dbConnect(); /* Connect DB. */

        /* Variables. */
        const body = await req.json().catch(() => ({}));
        const { email, password } = body;

        /*  Get user data using email. */
        const userDetails = await User.findOne({ email, deletedAt: null });

        if (!userDetails) return NextResponse.json({ message: "Please enter the valid email" }, { status: 400 }); /* Check the user is register. */
        if (userDetails?.status === 'inActive') return NextResponse.json({ message: "Please contact admin to activate your account" }, { status: 400 }); /* Return if the user is in inactive status. */

        /* Check password match. */
        const isMatch = await userDetails.comparePassword(password);
        if (!isMatch) return NextResponse.json({ message: "Please enter the valid password" }, { status: 400 });

        /* Validate the required data is provided from the client. */
        if (!email || !password) return NextResponse.json({ message: "Please provide the required data to login" }, { status: 400 });

        /* Generate auth token. */
        const token = await userDetails.generateAuthToken();

        /* Add the login timing in the Login schema to track progress. */
        const loginRecord = new Login({ userId: userDetails._id, token: token });
        await loginRecord.save();

        /* 5. Set the token in Browser Cookies */
        const cookieStore = await cookies();
        cookieStore.set("id_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 3 });

        /* Return if the process success. */
        return NextResponse.json({ message: 'Login successfull' }, { status: 200 })

    } catch (error) { return NextResponse.json({ message: `Something went wrong in login. Error: ${error}` }, { status: 400 }) };
};