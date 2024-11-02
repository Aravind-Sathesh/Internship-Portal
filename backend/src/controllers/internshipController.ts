import { Request, Response } from 'express';
import redisClient from '../config/redisClient';
import Internship from '../models/internship';
import Application from '../models/application';
import Employer from '../models/employer';
import sequelize from 'sequelize';

const CACHE_PREFIX = 'internship:';

// Create a new internship listing
export const createInternship = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { role, description, employerId, deadline } = req.body;

	try {
		const internship = await Internship.create({
			role,
			description,
			employerId,
			deadline,
		});
		res.status(201).json({
			message: 'Internship created successfully',
			internship,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// Select one internship by its internshipId
export const getInternshipById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const internship = await Internship.findOne({
			where: { id, is_active: true },
			attributes: { exclude: ['is_active'] },
		});
		if (!internship) {
			res.status(404).json({ message: 'Internship not found' });
			return;
		}
		res.status(200).json(internship);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// Fetch all internships, along with their employer details
export const getInternshipsWithEmployers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const internshipsWithEmployers = await Internship.findAll({
			where: { is_active: true },
			attributes: ['id', 'role', 'description', 'deadline'],
			include: [
				{
					model: Employer,
					attributes: ['id', 'name'],
				},
			],
		});

		const formattedInternships = internshipsWithEmployers.map(
			(internship: any) => ({
				internshipId: internship.id,
				employer: internship.Employer.name,
				employerId: internship.Employer.id,
				role: internship.role,
				description: internship.description,
				deadline: internship.deadline,
			})
		);

		res.status(200).json(formattedInternships);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// To update all internship details
export const updateInternship = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const { role, description, employerId, deadline } = req.body;

	try {
		const [updated] = await Internship.update(
			{ role, description, employerId, deadline },
			{ where: { id } }
		);
		if (!updated) {
			res.status(404).json({ message: 'Internship not found' });
			return;
		}
		const updatedInternship = await Internship.findByPk(id);
		res.status(200).json({
			message: 'Internship updated successfully',
			internship: updatedInternship,
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// To delete a particular internship and reject all related applications
export const deleteInternship = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const updatedInternship = await Internship.update(
			{ is_active: false },
			{ where: { id } }
		);

		if (!updatedInternship[0]) {
			res.status(404).json({ message: 'Internship not found' });
			return;
		}

		await Application.update(
			{ status: 'Rejected' },
			{ where: { internshipId: id } }
		);

		res.status(200).json({
			message: 'Internship marked as deleted successfully',
		});
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// To get internships for a particular employer with application count
export const getInternshipsByEmployerId = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { employerId } = req.params;
	try {
		const rolesWithCount = await Internship.findAll({
			where: { employerId, is_active: true },
			attributes: [
				'id',
				'role',
				'description',
				'deadline',
				[
					sequelize.fn('COUNT', sequelize.col('Applications.id')),
					'applicationCount',
				],
			],
			include: [
				{
					model: Application,
					attributes: [],
				},
			],
			group: [
				'Internship.id',
				'Internship.role',
				'Internship.description',
			],
		});

		const formattedRoles = rolesWithCount.map((role: any) => ({
			id: role.id,
			deadline: role.deadline,
			role: role.role,
			description: role.description,
			applicationCount: role.dataValues.applicationCount,
		}));

		res.status(200).json(formattedRoles);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

// To get all expanded details of one internship
export const getInternshipWithExpandedDetails = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const cacheKey = `${CACHE_PREFIX}${id}`;

		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			res.status(200).json(JSON.parse(cachedData));
			return;
		}

		const internshipWithEmployer = await Internship.findOne({
			where: { id, is_active: true },
			attributes: ['id', 'role', 'description', 'deadline', 'details'],
			include: [
				{
					model: Employer,
					attributes: ['id', 'name', 'photoUrl'],
				},
			],
		});

		if (!internshipWithEmployer) {
			res.status(404).send('Internship not found');
			return;
		}

		const formattedResponse = formatInternshipResponse(
			internshipWithEmployer
		);

		await redisClient.setex(
			cacheKey,
			8 * 60 * 60,
			JSON.stringify(formattedResponse)
		);

		res.status(200).json(formattedResponse);
	} catch (error) {
		console.error('Error fetching internship:', error);
		res.status(500).send('Internal server error');
	}
};

// Helper function to parse details string
const formatInternshipResponse = (internship: any): any => {
	const employer = internship.Employer;

	// Parse the details string into an object
	const details = JSON.parse(internship.details);

	return {
		internshipDetails: {
			role: internship.role,
			description: internship.description,
			deadline: internship.deadline,
			details: {
				salary: details.salary,
				techStack: details.techStack,
				academicRequirements: details.academicRequirements,
				expandedJobDescription: details.expandedJobDescription,
			},
		},
		employer: {
			name: employer.name,
			photoUrl: employer.photoUrl,
		},
	};
};
