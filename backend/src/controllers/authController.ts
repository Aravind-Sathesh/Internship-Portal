import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/student';

interface CustomUser extends Express.User {
	emails?: { value: string }[];
	displayName?: string;
	id?: string;
	photo?: string;
}

// Student Login: Authentication using Google OAuth
const googleCallback = async (req: Request, res: Response): Promise<void> => {
	const user = req.user as CustomUser;

	if (!user) {
		res.status(400).json({ error: 'User not found' });
		return;
	}

	const email = user.emails?.[0]?.value || 'No email found';
	const displayName = user.displayName || 'No name found';
	const userId = user.id || 'No ID found';
	const photo = user.photo || '';

	let studentId = userId;
	const match = email.match(/^f(\d{8})@hyderabad\.bits-pilani\.ac\.in$/);
	if (match) {
		const rollNumber = match[1];
		studentId = '411' + rollNumber;
	}

	const payload = {
		id: studentId,
		email: email,
		displayName: displayName,
		photo: photo,
	};

	const jwtSecret = process.env.JWT_SECRET as string;
	if (!jwtSecret) {
		throw new Error('JWT_SECRET is not defined');
	}

	const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

	const student = await Student.findOne({ where: { email } });

	res.cookie('token', token, { httpOnly: true, secure: true });

	if (!student) {
		res.redirect(`http://localhost:5173/update-profile`);
	} else {
		res.redirect(`http://localhost:5173/student-dashboard`);
	}
};

// Employer Login: BCrypt Authentication in MySQL Database
const userInfo = (req: Request, res: Response) => {
	const token = req.cookies.token;
	const jwtSecret = process.env.JWT_SECRET as string;

	if (!jwtSecret) {
		throw new Error('JWT_SECRET is not defined');
	}

	if (token) {
		jwt.verify(
			token,
			jwtSecret,
			(err: jwt.VerifyErrors | null, decoded: any) => {
				if (err) {
					return res.sendStatus(403);
				}

				const user = decoded as {
					id: string;
					email: string;
					displayName: string;
					photo: string;
				};
				res.json({
					user: {
						id: user.id,
						email: user.email,
						displayName: user.displayName,
						photo: user.photo,
					},
				});
			}
		);
	} else {
		res.sendStatus(401);
	}
};

export { googleCallback, userInfo };
