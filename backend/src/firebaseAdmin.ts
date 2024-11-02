import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import serviceAccount from './config/firebase-admin-sdk.json';

initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
	storageBucket: 'internship-portal-70289.appspot.com',
});

const storage = getStorage().bucket();

export const uploadFileToFirebase = async (
	fileBuffer: Buffer,
	destination: string,
	contentType: string
): Promise<string> => {
	try {
		const fileName = `${Date.now()}-${uuidv4()}`;
		const fileUpload = storage.file(`${destination}/${fileName}`);

		const stream = fileUpload.createWriteStream({
			metadata: {
				contentType,
			},
		});

		console.log(
			'File uploaded to URL:',
			`https://storage.googleapis.com/${storage.name}/${fileUpload.name}`
		);

		console.log('File buffer length:', fileBuffer.length);

		return new Promise((resolve, reject) => {
			stream.on('error', (err) => reject(err));
			stream.on('finish', async () => {
				await fileUpload.makePublic();
				resolve(
					`https://storage.googleapis.com/${storage.name}/${fileUpload.name}`
				);
			});

			stream.end(fileBuffer);
		});
	} catch (err) {
		const error = err as Error;
		throw new Error(`Failed to upload file to Firebase: ${error.message}`);
	}
};

export { storage };
