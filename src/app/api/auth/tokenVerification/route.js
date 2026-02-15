/* Plugins. */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/* Models. */
import User from "@/models/User";

/* Helpers. */
import dbConnect from "@/lib/db";

const jwtAccessToken = process.env.ACCESS_TOKEN;

export async function GET() {
    try {

        await dbConnect(); /* Connect DB. */

        /* Get token from Cookies */
        const cookieStore = await cookies();
        const token = cookieStore.get("id_token")?.value;

        /* If no token, return unauthorized */
        if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        /* Verify the token */
        let decoded;
        try { decoded = jwt.verify(token, jwtAccessToken) }
        catch (err) { return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 }) }

        /* Fetch user details from DB to ensure they still exist/are active */
        const user = await User.findById(decoded._id).select("-password");
        if (!user || user.status === 'inActive') return NextResponse.json({ message: "User no longer active" }, { status: 401 });

        /* Return user data */
        return NextResponse.json({ data: { _id: user?._id, name: user?.name, email: user?.email, phoneNumber: user?.phoneNumber, role: user?.role } }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Internal Error: ${error.message}` }, { status: 400 }) }
}