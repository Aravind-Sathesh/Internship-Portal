import express from 'express';
import {
	updateProfile,
	updateStudentProfile,
	getStudentProfile,
	deleteStudentProfile,
} from '../controllers/studentController';

const router = express.Router();

router.post('/initialize-profile', updateProfile);
router.get('/profile/:email', getStudentProfile);
router.put('/update-profile/:id', updateStudentProfile);
router.delete('/delete-profile/:id', deleteStudentProfile);

export default router;
