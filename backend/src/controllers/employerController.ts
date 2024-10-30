import { Request, Response } from 'express';
import Employer from '../models/employer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

export const updateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const { name, email, phoneNumber, address } = req.body;

	try {
		const [updated] = await Employer.update(
			{ name, email, phoneNumber, address },
			{ where: { id } }
		);

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
