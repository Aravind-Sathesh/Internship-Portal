import express from 'express';
import passport from 'passport';
import { googleCallback, userInfo } from '../controllers/authcontroller';

const router = express.Router();

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	googleCallback
);
router.get('/userinfo', userInfo);

export default router;
