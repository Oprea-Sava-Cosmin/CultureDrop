import {v2 as cloudinary} from 'cloudinary';
import path from 'path';

export const uploadPhotos = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const images = [
        path.resolve(__dirname, '../../../Photos/urban_final.png')
    ];

    try {
        for(const image of images) {
            const result = await cloudinary.uploader.upload(image,  {public_id: 'urban_final'});
            console.log('Upload successful: ' + result.secure_url);
        }
    }
    catch (error) {
        console.error('Upload failed: ', error);
    }

}