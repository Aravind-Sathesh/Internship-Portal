import { Request, Response } from 'express';
import Employer from '../models/employer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from '../config/nodemailer';
import jwt from 'jsonwebtoken';
import { uploadFileToFirebase } from '../firebaseAdmin';

// Handle login for employers
export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		const employer = await Employer.findOne({ where: { email } });
		if (!employer || !(await bcrypt.compare(password, employer.password))) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const payload = { id: employer.id, email: employer.email };
		const jwtSecret = process.env.JWT_SECRET as string;
		const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

		res.status(200).json({ message: 'Login successful', token });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// Register a new employer in the employers table
export const createProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { name, email, password, address, phoneNumber } = req.body;

	try {
		const existingEmployer = await Employer.findOne({ where: { email } });
		if (existingEmployer) {
			res.status(409).json({
				message: 'Employer with this email already exists',
			});
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newEmployer = await Employer.create({
			name,
			email,
			password: hashedPassword,
			address,
			phoneNumber,
		});

		res.status(201).json({
			message: 'Employer profile created successfully',
			employer: newEmployer,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// Update employer profile details
export const updateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const id = Number(req.params.id);
	const { name, email, phoneNumber, address } = req.body;
	const file = req.file;

	try {
		let photoUrl: string | undefined;

		if (file) {
			const destination = 'employer-profile-images';
			const buffer = file.buffer;
			const contentType = file.mimetype;

			// Upload the file to Firebase and get the URL
			photoUrl = await uploadFileToFirebase(
				buffer,
				destination,
				contentType
			);
		}

		const updateData = {
			name,
			email,
			phoneNumber,
			address,
			...(photoUrl && { photoUrl }),
		};

		// Update employer data
		const [updated] = await Employer.update(updateData, { where: { id } });

		if (!updated) {
			res.status(404).json({ message: 'Employer not found' });
			return;
		}

		const updatedEmployer = await Employer.findByPk(id);

		res.status(200).json({
			message: 'Employer profile updated successfully',
			employer: updatedEmployer,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// Delete employer profile
export const deleteProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const deleted = await Employer.destroy({
			where: { id },
		});

		if (!deleted) {
			res.status(404).json({ message: 'Employer not found' });
			return;
		}

		res.status(200).json({
			message: 'Employer profile deleted successfully',
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const sendPasswordResetEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email } = req.body;

	try {
		const employer = await Employer.findOne({ where: { email } });

		if (!employer) {
			res.status(404).json({ message: 'Employer not found' });
			return;
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const hashedToken = await bcrypt.hash(resetToken, 10);
		const tokenExpiration = new Date();
		tokenExpiration.setHours(tokenExpiration.getHours() + 1);

		employer.resetPasswordToken = hashedToken;
		employer.resetPasswordExpires = tokenExpiration;
		await employer.save();
		const resetUrl = `${
			process.env.FRONTEND_URL
		}/reset-password?token=${resetToken}&email=${encodeURIComponent(
			email
		)}`;

		const subject = 'Password Reset Request';
		const text = `Dear ${employer.name},
  
  We received a request to reset your password. Click the link below to reset your password:
  
  ${resetUrl}
  
  If you did not request this, please ignore this email or contact support if you have any concerns.
  
  This link will expire in 1 hour.
  
  Best regards,
The Internship Portal Team.`;

		await sendEmail({ to: email, subject, text });

		res.status(200).json({
			message: 'Password reset email sent successfully',
		});
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
	}
};

export const resetPassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { token, email, newPassword } = req.body;

	try {
		const employer = await Employer.findOne({ where: { email } });

		if (!employer) {
			res.status(404).json({ message: 'Employer not found' });
			return;
		}

		if (!employer.resetPasswordToken || !employer.resetPasswordExpires) {
			res.status(400).json({
				message: 'Invalid or expired password reset token',
			});
			return;
		}

		// Check if the token is valid and not expired
		const isTokenValid = await bcrypt.compare(
			token,
			employer.resetPasswordToken
		);
		const isTokenExpired = new Date() > employer.resetPasswordExpires;

		if (!isTokenValid || isTokenExpired) {
			res.status(400).json({
				message: 'Invalid or expired password reset token',
			});
			return;
		}

		// Hash the new password and update the employer's record
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		employer.password = hashedPassword;
		employer.resetPasswordToken = null;
		employer.resetPasswordExpires = null;
		await employer.save();

		res.status(200).json({
			message:
				'Password reset successfully. You can now log in with your new password.',
		});
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
	}
};
