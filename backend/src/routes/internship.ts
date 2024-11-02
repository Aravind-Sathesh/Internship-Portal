import express from 'express';
import {
	createInternship,
	getInternshipById,
	updateInternship,
	deleteInternship,
	getInternshipsWithEmployers,
	getInternshipsByEmployerId,
	getInternshipWithExpandedDetails,
} from '../controllers/internshipController';

const router = express.Router();

router.post('/', createInternship);
router.get('/with-employers', getInternshipsWithEmployers);
router.get('/:id', getInternshipById);
router.get('/expanded/:id', getInternshipWithExpandedDetails);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);
router.get('/by-employer/:employerId', getInternshipsByEmployerId);

export default router;
