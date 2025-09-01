"use server"


import fs from 'fs';
import path from 'path';

/**
 * Save an image buffer to the public/storage folder with a given filename.
 * Returns the saved filename.
 */
export async function saveImageLocally(buffer: Buffer, filename: string): Promise<string> {
	// Store in ../storage (outside Next.js project)
	const backend_storageDir = path.resolve(process.cwd(), '..', 'storage');
    const storageDir = path.join(process.cwd(), 'public', 'storage');

	if (!fs.existsSync(storageDir)) {
		fs.mkdirSync(storageDir, { recursive: true });
	}
	const filePath = path.join(storageDir, filename);
    const backend_filePath = path.join(backend_storageDir, filename);
    await fs.promises.writeFile(backend_filePath, buffer);
	await fs.promises.writeFile(filePath, buffer);
	return filename;
}

