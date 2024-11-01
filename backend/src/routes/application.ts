import express from 'express';
import {
	createApplication,
	getApplicationById,
	updateApplication,
	getApplicationsByStudentId,
	getApplicationsByEmployerId,
} from '../controllers/applicationController';

const router = express.Router();

router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.get('/student/:studentId', getApplicationsByStudentId);
router.get('/employer/:employerId', getApplicationsByEmployerId);
router.put('/:id', updateApplication);

export default router;
