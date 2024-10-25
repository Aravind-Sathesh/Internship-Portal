import express from 'express';
import { updateProfile } from '../controllers/studentController';

const router = express.Router();

router.post('/update-profile', updateProfile);

export default router;
