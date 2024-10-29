import express from 'express';
import {
	updateProfile,
	updateStudentProfile,
	getStudentProfile,
} from '../controllers/studentController';

const router = express.Router();

router.post('/initialize-profile', updateProfile);
router.get('/profile/:email', getStudentProfile);
router.put('/update-profile/:id', updateStudentProfile);

export default router;
