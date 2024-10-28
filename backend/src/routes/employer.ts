import express from 'express';
import { login, updateProfile } from '../controllers/employerController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.put('/update-profile/:id', updateProfile);
router.get('/profile', authenticateToken, (req, res) => {
	res.json(req.employer);
});

export default router;
