import express from 'express';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import './passport'; // Make sure this imports your passport configuration

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173', // Specify the frontend origin
		credentials: true, // Allow cookies to be sent
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
		allowedHeaders:
			'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Allowed headers
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

app.listen(5000, () => {
	console.log('Server is running on http://localhost:5000');
});
