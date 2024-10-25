import { Request, Response } from 'express';
import Internship from '../models/internship';

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

export const getAllInternships = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const internships = await Internship.findAll();
		res.status(200).json(internships);
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};

export const getInternshipById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const internship = await Internship.findByPk(id);
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

export const deleteInternship = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const deleted = await Internship.destroy({ where: { id } });
		if (!deleted) {
			res.status(404).json({ message: 'Internship not found' });
			return;
		}
		res.status(200).json({ message: 'Internship deleted successfully' });
	} catch (err) {
		const error = err as Error;
		res.status(400).json({ error: error.message });
	}
};
