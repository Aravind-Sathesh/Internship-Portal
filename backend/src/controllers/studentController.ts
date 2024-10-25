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
