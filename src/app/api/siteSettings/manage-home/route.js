/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/* Database connection. */
import dbConnect from "@/lib/db";

/* Model. */
import Home from "@/models/Home";

export async function POST(req) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'home');
        await mkdir(uploadDir, { recursive: true });

        const settingsToUpdate = {};

        /* ── Text Fields ── */
        const textFields = [
            'heroTitle', 'heroSubtitle',
            'welcomeTag', 'welcomeTitle', 'welcomeDescription',
            'featuresTag', 'featuresTitle', 'featuresSubtitle',
            'roomsTag', 'roomsTitle', 'roomsSubtitle',
            'testimonialsTag', 'testimonialsTitle',
            'ctaTitle', 'ctaText', 'ctaButtonText',
        ];

        for (const fieldName of textFields) {
            const value = formData.get(fieldName);
            if (value !== null && value !== undefined) {
                settingsToUpdate[fieldName] = value;
            }
        }

        /* ── JSON Array Fields ── */
        const jsonFields = ['heroSlides', 'features', 'rooms', 'testimonials'];
        for (const fieldName of jsonFields) {
            const value = formData.get(fieldName);
            if (value) {
                settingsToUpdate[fieldName] = value;
            }
        }

        /* ── Hero Slide Images ── */
        const existingHeroImages = formData.getAll('existingHeroImages');
        const newHeroImageFiles = formData.getAll('heroImages');

        /* Delete removed hero images */
        const currentHeroDoc = await Home.findOne({ key: 'heroImages' });
        if (currentHeroDoc && currentHeroDoc.value) {
            const currentImages = JSON.parse(currentHeroDoc.value);
            for (const imgName of currentImages) {
                if (!existingHeroImages.includes(imgName)) {
                    const oldPath = path.join(uploadDir, imgName);
                    if (fs.existsSync(oldPath)) {
                        await unlink(oldPath).catch(err => console.error('Error deleting hero image:', err));
                    }
                }
            }
        }

        /* Save new hero images */
        const finalHeroImages = [...existingHeroImages];
        for (const file of newHeroImageFiles) {
            if (file && file instanceof File && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const timestamp = Date.now();
                const randomSuffix = Math.floor(Math.random() * 10000);
                const ext = file.name.split('.').pop();
                const fileName = `hero_${timestamp}_${randomSuffix}.${ext}`;
                await writeFile(path.join(uploadDir, fileName), buffer);
                finalHeroImages.push(fileName);
            }
        }
        settingsToUpdate['heroImages'] = JSON.stringify(finalHeroImages);

        /* ── Welcome Images ── */
        const existingWelcomeImages = formData.getAll('existingWelcomeImages');
        const newWelcomeImageFiles = formData.getAll('welcomeImages');

        const currentWelcomeDoc = await Home.findOne({ key: 'welcomeImages' });
        if (currentWelcomeDoc && currentWelcomeDoc.value) {
            const currentImages = JSON.parse(currentWelcomeDoc.value);
            for (const imgName of currentImages) {
                if (!existingWelcomeImages.includes(imgName)) {
                    const oldPath = path.join(uploadDir, imgName);
                    if (fs.existsSync(oldPath)) {
                        await unlink(oldPath).catch(err => console.error('Error deleting welcome image:', err));
                    }
                }
            }
        }

        const finalWelcomeImages = [...existingWelcomeImages];
        for (const file of newWelcomeImageFiles) {
            if (file && file instanceof File && file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const timestamp = Date.now();
                const randomSuffix = Math.floor(Math.random() * 10000);
                const ext = file.name.split('.').pop();
                const fileName = `welcome_${timestamp}_${randomSuffix}.${ext}`;
                await writeFile(path.join(uploadDir, fileName), buffer);
                finalWelcomeImages.push(fileName);
            }
        }
        settingsToUpdate['welcomeImages'] = JSON.stringify(finalWelcomeImages);

        /* ── CTA Background Image ── */
        const ctaImageFile = formData.get('ctaImage');
        const existingCtaImage = formData.get('existingCtaImage');

        if (ctaImageFile && ctaImageFile instanceof File && ctaImageFile.size > 0) {
            const currentCtaDoc = await Home.findOne({ key: 'ctaImage' });
            if (currentCtaDoc && currentCtaDoc.value) {
                const oldPath = path.join(uploadDir, currentCtaDoc.value);
                if (fs.existsSync(oldPath)) {
                    await unlink(oldPath).catch(err => console.error('Error deleting CTA image:', err));
                }
            }
            const bytes = await ctaImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const timestamp = Date.now();
            const ext = ctaImageFile.name.split('.').pop();
            const fileName = `cta_${timestamp}.${ext}`;
            await writeFile(path.join(uploadDir, fileName), buffer);
            settingsToUpdate['ctaImage'] = fileName;
        } else if (existingCtaImage) {
            settingsToUpdate['ctaImage'] = existingCtaImage;
        }

        /* ── Save All to DB ── */
        const jsonDbFields = ['heroImages', 'welcomeImages', 'heroSlides', 'features', 'rooms', 'testimonials'];
        const updatePromises = Object.entries(settingsToUpdate).map(async ([key, value]) => {
            return await Home.findOneAndUpdate(
                { key },
                { key, value, updatedAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: 'Home page updated successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in manageHome POST:', error);
        return NextResponse.json({
            success: false,
            message: `Something went wrong. Error: ${error.message}`
        }, { status: 400 });
    }
}

export async function GET() {
    try {
        await dbConnect();

        const homeData = await Home.find({});
        const jsonFields = ['heroImages', 'welcomeImages', 'heroSlides', 'features', 'rooms', 'testimonials'];

        const formattedData = {};
        homeData.forEach(item => {
            if (jsonFields.includes(item.key)) {
                try {
                    formattedData[item.key] = {
                        value: JSON.parse(item.value),
                        updatedAt: item.updatedAt
                    };
                } catch {
                    formattedData[item.key] = { value: item.value, updatedAt: item.updatedAt };
                }
            } else {
                formattedData[item.key] = { value: item.value, updatedAt: item.updatedAt };
            }
        });

        return NextResponse.json({ success: true, data: formattedData }, { status: 200 });

    } catch (error) {
        console.error('Error fetching home data:', error);
        return NextResponse.json({
            success: false,
            message: `Error fetching home data: ${error.message}`
        }, { status: 400 });
    }
}