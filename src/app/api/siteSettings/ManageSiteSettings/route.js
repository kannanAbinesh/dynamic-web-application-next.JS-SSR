/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/* Model. */
import SiteSetting from "@/models/SiteSettings";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'siteSettings');

        await mkdir(uploadDir, { recursive: true });

        const settingsToUpdate = {};

        const imageFields = ['logo', 'darkThemeLogo', 'favicon'];

        for (const fieldName of imageFields) {
            const file = formData.get(fieldName);

            if (file && file instanceof File && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const timestamp = Date.now();
                const fileExtension = file.name.split('.').pop();
                const fileName = `${fieldName}_${timestamp}.${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                const existingSetting = await SiteSetting.findOne({ key: fieldName });
                if (existingSetting && existingSetting.value) {
                    const oldFilePath = path.join(uploadDir, existingSetting.value);
                    if (fs.existsSync(oldFilePath)) await unlink(oldFilePath).catch(err => console.log('Old file delete error:', err));
                }
                await writeFile(filePath, buffer);
                settingsToUpdate[fieldName] = fileName;
            } else {
                const existingImageKey = `existing${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
                const existingImage = formData.get(existingImageKey);
                if (existingImage) settingsToUpdate[fieldName] = existingImage;
            }
        }

        const textFields = ['siteName', 'poweredBy', 'siteMail', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest', 'whatsapp', 'mail'];
        for (const fieldName of textFields) {
            const value = formData.get(fieldName);
            if (value !== null && value !== undefined && value !== '') settingsToUpdate[fieldName] = value;
        };

        const updatePromises = Object.entries(settingsToUpdate).map(async ([key, value]) => {
            return await SiteSetting.findOneAndUpdate(
                { key },
                { key, value, updatedAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true });
        });

        await Promise.all(updatePromises);
        return NextResponse.json({ message: 'Site settings updated successfully' }, { status: 200 });

    } catch (error) { return NextResponse.json({ message: `Something went wrong in managing site settings data. Error: ${error.message}` }, { status: 400 }) }
}