import { v2 as cloudinary } from 'cloudinary';
import { ImageStorage, UploadImageOptions } from '../../domain/adapters/image-storage.adapter';

export interface CloudinaryImageStorageOptions {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
}

export class CloudinaryImageStorage implements ImageStorage {

    constructor({ cloudName, apiKey, apiSecret }: CloudinaryImageStorageOptions) {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
    }

    upload({ key, buffer }: UploadImageOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: key,
                    overwrite: true,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error ?? new Error('Cloudinary upload failed'));
                    }
                    resolve(result.secure_url);
                },
            );

            stream.end(buffer);
        });
    }

    async delete(key: string): Promise<void> {
        await cloudinary.uploader.destroy(key, { resource_type: 'image' });
    }
}

