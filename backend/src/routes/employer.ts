import express from 'express';
import { login } from '../controllers/employerController';

const router = express.Router();

router.post('/login', login);

export default router;
