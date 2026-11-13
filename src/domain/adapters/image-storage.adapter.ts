export interface UploadImageOptions {
    key: string;
    buffer: Buffer;
    mimeType: string;
}

export abstract class ImageStorage {
    abstract upload(options: UploadImageOptions): Promise<string>;
    abstract delete(key: string): Promise<void>;
}

