import express from 'express';
import {
	createApplication,
	getAllApplications,
	getApplicationById,
	updateApplication,
	deleteApplication,
	cancelApplication,
	acceptApplication,
	getApplicationsByStudentId,
	getApplicationsByEmployerId,
} from '../controllers/applicationController';

const router = express.Router();

router.post('/', createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.get('/employer/:employerId', getApplicationsByEmployerId);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.get('/student/:studentId', getApplicationsByStudentId);
router.post('/:id/cancel', cancelApplication);
router.post('/:id/accept', acceptApplication);

export default router;
