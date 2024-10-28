import express from 'express';
import {
	createInternship,
	getAllInternships,
	getInternshipById,
	updateInternship,
	deleteInternship,
	getRoles,
} from '../controllers/internshipController';

const router = express.Router();

router.post('/', createInternship);
router.get('/', getAllInternships);
router.get('/:id', getInternshipById);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);
router.get('/roles/:employerId', getRoles);

export default router;
