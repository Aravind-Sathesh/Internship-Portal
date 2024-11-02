import { Request, Response } from 'express';
import Student from '../models/student';
import Application from '../models/application';
import { uploadFileToFirebase } from '../firebaseAdmin';

export const updateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email, name, phoneNumber, address, bitsId } = req.body;
	const file = req.file;

	try {
		let photoUrl: string | undefined;

		if (file) {
			const destination = 'profile-images';
			const buffer = file.buffer;
			const contentType = file.mimetype;

			photoUrl = await uploadFileToFirebase(
				buffer,
				destination,
				contentType
			);
		}

		const [student, created] = await Student.findOrCreate({
			where: { email },
			defaults: { name, phoneNumber, address, bitsId, photoUrl },
		});

		if (!created) {
			student.name = name;
			student.phoneNumber = phoneNumber;
			student.address = address;
			student.bitsId = bitsId;

			if (photoUrl) {
				student.photoUrl = photoUrl;
			}

			await student.save();
		}

		res.status(200).json({
			message: 'Profile updated successfully',
			student,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getStudentProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email } = req.params;

	try {
		const student = await Student.findOne({
			where: { email },
		});

		if (!student) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		res.status(200).json(student);
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
	}
};

export const initializeProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const { name, email, phoneNumber, address } = req.body;

	try {
		const [updated] = await Student.update(
			{ name, email, phoneNumber, address },
			{ where: { id } }
		);

		if (!updated) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		const updatedStudent = await Student.findByPk(id);

		res.status(200).json({
			message: 'Student profile updated successfully',
			student: updatedStudent,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const deleteStudentProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		await Application.destroy({
			where: { studentId: id },
		});

		const deleted = await Student.destroy({
			where: { id },
		});

		if (!deleted) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		res.status(200).json({
			message: 'Student profile deleted successfully',
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const uploadStudentDocuments = async (req: Request, res: Response) => {
	const { studentId } = req.params;
	const files = req.files as Express.Multer.File[] | undefined;

	if (!files || files.length === 0) {
		return res.status(400).json({ message: 'No files uploaded' });
	}

	try {
		const documentUrls: string[] = [];

		for (const file of files) {
			const documentUrl = await uploadFileToFirebase(
				file.buffer,
				`students/${studentId}/documents`,
				file.mimetype
			);
			documentUrls.push(documentUrl);
		}

		const student = await Student.findByPk(studentId);
		if (student) {
			const existingDocuments = student.documents
				? student.documents.split(',')
				: [];
			const updatedDocuments = existingDocuments.concat(documentUrls);

			student.documents = updatedDocuments.join(','); // Store as comma-separated string
			await student.save();
		} else {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({ success: true, documentUrls });
	} catch (error) {
		console.error('Error uploading documents:', error);
		res.status(500).json({
			success: false,
			error: 'Failed to upload documents',
		});
	}
};
