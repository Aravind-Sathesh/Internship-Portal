import express from 'express';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/associations';
import studentRoutes from './routes/student';
import employerRoutes from './routes/employer';
import internshipRoutes from './routes/internship';
import applicationRoutes from './routes/application';
import './passport';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders:
			'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	})
);
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/employer', employerRoutes);
app.use('/internships', internshipRoutes);
app.use('/applications', applicationRoutes);

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

sequelize.sync({ force: false }).then(() => {
	app.listen(5000, () => {
		console.log('Server is running on http://localhost:5000');
	});
});
