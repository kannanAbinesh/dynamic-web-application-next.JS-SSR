/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/* Database connection. */
import dbConnect from "@/lib/db";

/* Model. */
import ContactUs from "@/models/ContactUs";

export async function POST(req) {
    try {
        
        await dbConnect();

        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contactUs');

        await mkdir(uploadDir, { recursive: true });

        const settingsToUpdate = {};

        const imageFields = ['triangleImage', 'squareImage', 'circleImage'];

        for (const fieldName of imageFields) {
            const file = formData.get(fieldName);

            if (file && file instanceof File && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const timestamp = Date.now();
                const fileExtension = file.name.split('.').pop();
                const fileName = `${fieldName}_${timestamp}.${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                const existingSetting = await ContactUs.findOne({ key: fieldName });
                if (existingSetting && existingSetting.value) {
                    const oldFilePath = path.join(uploadDir, existingSetting.value);
                    if (fs.existsSync(oldFilePath)) {
                        await unlink(oldFilePath).catch(err => { });
                    }
                }

                await writeFile(filePath, buffer);
                settingsToUpdate[fieldName] = fileName;
            } else {
                const existingImageKey = `existing${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
                const existingImage = formData.get(existingImageKey);
                if (existingImage) settingsToUpdate[fieldName] = existingImage;
            }
        }

        const textFields = ['header', 'description'];
        for (const fieldName of textFields) {
            const value = formData.get(fieldName);
            if (value !== null && value !== undefined && value !== '') {
                settingsToUpdate[fieldName] = value;
            }
        }

        const updatePromises = Object.entries(settingsToUpdate).map(async ([key, value]) => {
            return await ContactUs.findOneAndUpdate(
                { key },
                { key, value, updatedAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: 'Contact Us page updated successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in manageContactUs:', error);
        return NextResponse.json({
            success: false,
            message: `Something went wrong in managing contact us data. Error: ${error.message}`
        }, { status: 400 });
    }
}

export async function GET() {
    try {
        await dbConnect();

        const contactUsData = await ContactUs.find({});

        const formattedData = {};
        contactUsData.forEach(item => {
            formattedData[item.key] = {
                value: item.value,
                updatedAt: item.updatedAt
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedData
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching contact us data:', error);
        return NextResponse.json({
            success: false,
            message: `Error fetching contact us data: ${error.message}`
        }, { status: 400 });
    }
}