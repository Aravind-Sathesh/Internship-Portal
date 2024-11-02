import express, { Request, Response } from 'express';
import multer from 'multer';
import {
	updateProfile as updateStudentProfile,
	uploadStudentDocuments,
} from '../controllers/studentController';
import { updateProfile as updateEmployerProfile } from '../controllers/employerController';

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.put(
	'/update-profile/:type/:id',
	upload.single('file'),
	async (req: Request, res: Response) => {
		const { type } = req.params;

		try {
			if (type === 'student') {
				await updateStudentProfile(req, res);
			} else if (type === 'employer') {
				await updateEmployerProfile(req, res);
			} else {
				res.status(400).json({ message: 'Invalid profile type' });
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}
);

router.post(
	'/upload-documents/:studentId',
	upload.array('documents', 3), // Restrict to 3 documents max
	async (req: Request, res: Response) => {
		try {
			await uploadStudentDocuments(req, res);
		} catch (error) {
			console.error('Error uploading documents:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}
);

export default router;
