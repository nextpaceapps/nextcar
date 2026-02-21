import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgress {
    progress: number;
    downloadURL?: string;
}

export const storageService = {
    /**
     * Upload a car image to Firebase Storage.
     * Returns the download URL when complete.
     * Calls onProgress with upload percentage.
     */
    async uploadCarImage(
        carId: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<string> {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storageRef = ref(storage, `cars/${carId}/${timestamp}_${safeName}`);

        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress?.(Math.round(progress));
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    },

    /**
     * Delete a car image from Firebase Storage by its download URL.
     */
    async deleteCarImage(imageUrl: string): Promise<void> {
        try {
            const storageRef = ref(storage, imageUrl);
            await deleteObject(storageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
            // Don't throw — image may already be deleted
        }
    },

    /**
     * Upload multiple car images in parallel.
     * Returns an array of download URLs.
     */
    async uploadMultipleImages(
        carId: string,
        files: File[],
        onProgress?: (fileIndex: number, progress: number) => void
    ): Promise<string[]> {
        const uploads = files.map((file, index) =>
            this.uploadCarImage(carId, file, (progress) => {
                onProgress?.(index, progress);
            })
        );

        return Promise.all(uploads);
    },
};
