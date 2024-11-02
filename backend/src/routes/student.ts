import express from 'express';
import {
	updateProfile,
	initializeProfile,
	getStudentProfile,
	deleteStudentProfile,
} from '../controllers/studentController';

const router = express.Router();

router.post('/initialize-profile', updateProfile);
router.get('/profile/:email', getStudentProfile);
router.put('/update-profile/:id', initializeProfile);
router.delete('/delete-profile/:id', deleteStudentProfile);

export default router;
