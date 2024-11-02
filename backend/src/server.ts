import express from 'express';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import sequelize from './config/database';
import studentRoutes from './routes/student';
import employerRoutes from './routes/employer';
import internshipRoutes from './routes/internship';
import applicationRoutes from './routes/application';
import uploadRoutes from './routes/upload';

import './models/associations'; // Import associations for Sequelize models
import './passport'; // Initialize passport configuration

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS for specified origin and set allowed methods/headers
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders:
			'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	})
);

// Session management setup
app.use(
	session({
		secret: process.env.SESSION_SECRET as string, // Use session secret from environment variables
		resave: false,
		saveUninitialized: false,
	})
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Route handlers
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/employer', employerRoutes);
app.use('/internships', internshipRoutes);
app.use('/applications', applicationRoutes);
app.use('/upload', uploadRoutes);

// Logout route
app.post('/logout', (req, res) => {
	res.clearCookie('token');
	req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session', err);
			return res.status(500).send('Error logging out');
		}
		res.status(200).send('Logged out');
	});
});

// Sync database and start the server
sequelize.sync({ force: false }).then(() => {
	app.listen(process.env.PORT, () => {
		console.log(
			`Server is running on http://localhost:${process.env.PORT}`
		);
	});
});
