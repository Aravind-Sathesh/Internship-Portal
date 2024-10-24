import express from 'express';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import './passport';
import sequelize from './config/database';
import studentRoutes from './routes/student';

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
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/test', (req, res) => {
	res.send('Backend connected.');
});

app.use('/auth', authRoutes);

sequelize.sync({ force: false });
app.use('/student', studentRoutes);

app.listen(5000, () => {
	console.log('Server is running on http://localhost:5000');
});
