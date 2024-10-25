import { Request, Response } from 'express';
import Application from '../models/application';
import Internship from '../models/internship';
import Employer from '../models/employer';

export const createApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { studentId, internshipId, status } = req.body;

	try {
		const application = await Application.create({
			studentId,
			internshipId,
			status,
		});
		res.status(201).json({
			message: 'Application created successfully',
			application,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getAllApplications = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const applications = await Application.findAll();
		res.status(200).json(applications);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getApplicationById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const application = await Application.findByPk(id);
		if (!application) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		res.status(200).json(application);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getApplicationsByStudentId = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { studentId } = req.params;

	try {
		const applications = await Application.findAll({
			where: { studentId },
			include: [
				{
					model: Internship,
					include: [Employer],
				},
			],
		});

		res.status(200).json(applications);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const updateApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const { studentId, internshipId, status } = req.body;

	try {
		const [updated] = await Application.update(
			{ studentId, internshipId, status },
			{ where: { id } }
		);
		if (!updated) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		const updatedApplication = await Application.findByPk(id);
		res.status(200).json({
			message: 'Application updated successfully',
			application: updatedApplication,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const cancelApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const application = await Application.findByPk(id);
		if (!application) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		application.status = 'Cancelled';
		await application.save();
		res.status(200).json({ message: 'Application cancelled successfully' });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const acceptApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const application = await Application.findByPk(id);
		if (!application) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		application.status = 'Accepted';
		await application.save();
		res.status(200).json({ message: 'Application cancelled successfully' });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};
export const deleteApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const deleted = await Application.destroy({ where: { id } });
		if (!deleted) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		res.status(200).json({ message: 'Application deleted successfully' });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};
