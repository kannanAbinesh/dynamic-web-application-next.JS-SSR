/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/* Database connection. */
import dbConnect from "@/lib/db";

/* Model. */
import AboutUs from "@/models/AboutUs";

export async function POST(req) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'aboutUs');

        await mkdir(uploadDir, { recursive: true });

        const settingsToUpdate = {};

        /* ── Text Fields ── */
        const textFields = ['bannerHeader', 'bannerDescription', 'mainDescription'];
        for (const fieldName of textFields) {
            const value = formData.get(fieldName);
            if (value !== null && value !== undefined && value !== '') {
                settingsToUpdate[fieldName] = value;
            }
        }

        /* ── Cards (JSON) ── */
        const cardsValue = formData.get('cards');
        if (cardsValue) {
            settingsToUpdate['cards'] = cardsValue;
        }

        /* ── Banner Images (multiple) ── */
        const newBannerImages = formData.getAll('bannerImages');
        const existingBannerImages = formData.getAll('existingBannerImages');

        /* Get current banner images from DB to delete removed ones */
        const currentBannerImageDoc = await AboutUs.findOne({ key: 'bannerImages' });
        if (currentBannerImageDoc && currentBannerImageDoc.value) {
            const currentImages = JSON.parse(currentBannerImageDoc.value);

            /* Delete files that are no longer in existingBannerImages */
            for (const imgName of currentImages) {
                if (!existingBannerImages.includes(imgName)) {
                    const oldFilePath = path.join(uploadDir, imgName);
                    if (fs.existsSync(oldFilePath)) {
                        await unlink(oldFilePath).catch(err => console.error('Error deleting banner image:', err));
                    }
                }
            }
        }

        /* Save new banner images and collect all final image names */
        const finalBannerImages = [...existingBannerImages];

        for (const file of newBannerImages) {
            if (file && file instanceof File && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const timestamp = Date.now();
                const randomSuffix = Math.floor(Math.random() * 10000);
                const fileExtension = file.name.split('.').pop();
                const fileName = `bannerImage_${timestamp}_${randomSuffix}.${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                await writeFile(filePath, buffer);
                finalBannerImages.push(fileName);
            }
        }

        /* Store banner images array as JSON string */
        settingsToUpdate['bannerImages'] = JSON.stringify(finalBannerImages);

        /* ── Video ── */
        const videoFile = formData.get('video');
        const existingVideo = formData.get('existingVideo');

        if (videoFile && videoFile instanceof File && videoFile.size > 0) {
            /* Delete old video if exists */
            const existingVideoDoc = await AboutUs.findOne({ key: 'video' });
            if (existingVideoDoc && existingVideoDoc.value) {
                const oldVideoPath = path.join(uploadDir, existingVideoDoc.value);
                if (fs.existsSync(oldVideoPath)) {
                    await unlink(oldVideoPath).catch(err => console.error('Error deleting old video:', err));
                }
            }

            /* Save new video */
            const bytes = await videoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const timestamp = Date.now();
            const fileExtension = videoFile.name.split('.').pop();
            const fileName = `video_${timestamp}.${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);

            /* Store only the filename in DB */
            settingsToUpdate['video'] = fileName;

        } else if (existingVideo) {
            /* Keep existing video */
            settingsToUpdate['video'] = existingVideo;
        }

        /* ── Save all to DB ── */
        const updatePromises = Object.entries(settingsToUpdate).map(async ([key, value]) => {
            return await AboutUs.findOneAndUpdate(
                { key },
                { key, value, updatedAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: 'About Us page updated successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in manageAboutUs POST:', error);
        return NextResponse.json({
            success: false,
            message: `Something went wrong in managing about us data. Error: ${error.message}`
        }, { status: 400 });
    }
}

export async function GET() {
    try {
        await dbConnect();

        const aboutUsData = await AboutUs.find({});

        const formattedData = {};
        aboutUsData.forEach(item => {
            /* Parse JSON fields back to arrays/objects */
            if (item.key === 'bannerImages' || item.key === 'cards') {
                try {
                    formattedData[item.key] = {
                        value: JSON.parse(item.value),
                        updatedAt: item.updatedAt
                    };
                } catch {
                    formattedData[item.key] = {
                        value: item.value,
                        updatedAt: item.updatedAt
                    };
                }
            } else {
                formattedData[item.key] = {
                    value: item.value,
                    updatedAt: item.updatedAt
                };
            }
        });

        return NextResponse.json({
            success: true,
            data: formattedData
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching about us data:', error);
        return NextResponse.json({
            success: false,
            message: `Error fetching about us data: ${error.message}`
        }, { status: 400 });
    }
}