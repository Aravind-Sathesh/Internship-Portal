import { Request, Response } from 'express';
import sequelize from 'sequelize';
import Application from '../models/application';
import Internship from '../models/internship';
import Student from '../models/student';
import Employer from '../models/employer';

// Create a new application in the applications table
export const createApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { studentId, internshipId } = req.body;
	const status = 'Applied'; // Status of a newly created application will be set to 'Applied'
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

// Get a single application by its id
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
					where: { is_active: true },
					attributes: { exclude: ['is_active'] }, // Only get the applications whose internships are not deleted (is_active = 1)
					include: [{ model: Employer }],
				},
				{ model: Student },
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

// Get all applications for a particular student, including the related role from the internships table
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
					where: { is_active: true },
					attributes: ['role'],
					include: [{ model: Employer, attributes: ['name'] }],
				},
			],
		});

		const formattedApplications = applications.map((app: any) => {
			const internship = app.get('Internship');
			const employer = internship?.get('Employer');
			return {
				// Only return the required fields
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

// Get all applications for internships for one specific employer
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
					where: { is_active: true },
					attributes: ['role', 'id'],
					include: [{ model: Employer, attributes: ['name'] }], // To include the internship name and id
				},
				{
					model: Student,
					attributes: ['id', 'name'], // To include the applicant name and id
				},
			],
			order: [
				// Sort the applications in a order progressively matching the status
				[
					sequelize.literal(
						`FIELD(status, 'Accepted', 'Offer Given', 'Interview Scheduled', 'Applied', 'Rejected', 'Withdrawn')`
					),
					'ASC',
				],
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
				internshipId: internship?.id || 'N/A',
			};
		});

		res.status(200).json(formattedApplications);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// To update the status of a particular application
// Employer - set any status
// Student - wihdraw or accept
export const updateApplication = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		const application = await Application.findByPk(id);
		if (!application) {
			res.status(404).json({ message: 'Application not found' });
			return;
		}
		application.status = status;
		await application.save();
		res.status(200).json({ message: 'Application updated successfully' });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};
