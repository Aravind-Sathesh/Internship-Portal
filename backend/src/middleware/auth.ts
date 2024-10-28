import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Employer from '../models/employer';

declare global {
	namespace Express {
		interface Request {
			employer?: InstanceType<typeof Employer>;
		}
	}
}

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	const jwtSecret = process.env.JWT_SECRET as string;

	if (!token) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as { email: string };
		const employer = await Employer.findOne({
			where: { email: decoded.email },
		});

		if (!employer) {
			res.status(404).json({ message: 'Employer not found' });
			return;
		}

		req.employer = employer;
		next();
	} catch (err) {
		res.status(403).json({ message: 'Invalid token' });
	}
};
