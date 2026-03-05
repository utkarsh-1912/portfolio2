import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
        }

        // Convert the file to a buffer and then to base64
        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        const imgbbApiKey = process.env.IMGBB_API_KEY;
        if (!imgbbApiKey) {
            return NextResponse.json({ error: 'Missing IMGBB_API_KEY environment variable' }, { status: 500 });
        }

        const imgbbFormData = new URLSearchParams();
        imgbbFormData.append('key', imgbbApiKey);
        imgbbFormData.append('image', base64Image);

        // Provide a neat name if possible
        imgbbFormData.append('name', file.name.split('.')[0]);

        const res = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: imgbbFormData,
        });

        const data = await res.json();

        if (!data.success) {
            console.error('Imgbb upload error:', data);
            return NextResponse.json({ error: 'ImgBB upload failed' }, { status: 500 });
        }

        // data.data.url contains the direct image URL
        return NextResponse.json({ url: data.data.url });

    } catch (error) {
        console.error('File upload API error:', error);
        return NextResponse.json({ error: 'Internal server error while uploading image' }, { status: 500 });
    }
}
