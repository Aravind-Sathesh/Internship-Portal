import express from 'express';
import {
	createInternship,
	getAllInternships,
	getInternshipById,
	updateInternship,
	deleteInternship,
} from '../controllers/internshipController';

const router = express.Router();

router.post('/', createInternship);
router.get('/', getAllInternships);
router.get('/:id', getInternshipById);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);

export default router;
