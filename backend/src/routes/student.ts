import express from 'express';
import {
	updateProfile,
	updateStudentProfile,
	getStudentProfile,
} from '../controllers/studentController';

const router = express.Router();

router.post('/update-profile', updateProfile);
router.get('/profile/:email', getStudentProfile);
router.put('/profile/:id', updateStudentProfile);

export default router;
