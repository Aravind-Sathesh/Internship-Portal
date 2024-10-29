import { Request, Response } from 'express';
import Student from '../models/student';

export const updateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email, name, phoneNumber, address, bitsId, photoUrl } = req.body;

	try {
		const [student, created] = await Student.findOrCreate({
			where: { email },
			defaults: { name, phoneNumber, address, bitsId, photoUrl },
		});

		if (!created) {
			student.name = name;
			student.phoneNumber = phoneNumber;
			student.address = address;
			student.bitsId = bitsId;
			student.photoUrl = photoUrl;
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

export const updateStudentProfile = async (
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
