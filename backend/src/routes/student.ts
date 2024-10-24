import express from 'express';
import Student from '../models/student';
const router = express.Router();

router.post('/complete-profile', async (req, res) => {
	const { email, name, phoneNumber, address, bitsId, photoUrl } = req.body;

	try {
		const student = new Student({
			email,
			name,
			phoneNumber,
			address,
			bitsId,
			photoUrl,
		});
		await student.save();
		res.status(201).json({
			message: 'Profile completed successfully',
			student,
		});
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
