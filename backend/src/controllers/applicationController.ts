import { Request, Response } from 'express';
import Application from '../models/application';
import Internship from '../models/internship';
import Student from '../models/student';
import Employer from '../models/employer';

export const createApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { studentId, internshipId } = req.body;
	const status = 'Applied';
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
		const applications = await Application.findAll({
			include: [
				{
					model: Internship,
					include: [Employer],
				},
				{
					model: Student,
				},
			],
		});
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
		const application = await Application.findByPk(id, {
			include: [
				{
					model: Internship,
					include: [Employer],
				},
				{
					model: Student,
				},
			],
		});
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
			attributes: ['id', 'status'],
			include: [
				{
					model: Internship,
					attributes: ['role'],
					include: [
						{
							model: Employer,
							attributes: ['name'],
						},
					],
				},
			],
		});

		const formattedApplications = applications.map((app: any) => {
			const internship = app.get('Internship');
			const employer = internship?.get('Employer');
			return {
				id: app.id,
				role: internship?.role || 'N/A',
				employer: employer?.name || 'N/A',
				status: app.status,
			};
		});

		res.status(200).json(formattedApplications);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getApplicationsByEmployerId = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { employerId } = req.params;
	try {
		const applications = await Application.findAll({
			where: { '$Internship.Employer.id$': employerId },
			attributes: ['id', 'status'],
			include: [
				{
					model: Internship,
					attributes: ['role'],
					include: [
						{
							model: Employer,
							attributes: ['name'],
						},
					],
				},
				{
					model: Student,
					attributes: ['id', 'name'],
				},
			],
		});

		const formattedApplications = applications.map((app: any) => {
			const internship = app.get('Internship');
			const student = app.get('Student');
			return {
				id: app.id || 'N/A',
				studentId: student?.id || 'N/A',
				studentName: student?.name || 'N/A',
				role: internship?.role || 'N/A',
				status: app.status,
			};
		});

		res.status(200).json(formattedApplications);
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

export const withdrawApplication = async (
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
		application.status = 'Withdrawn';
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
