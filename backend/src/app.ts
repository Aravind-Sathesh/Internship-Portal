import express from 'express';
import cors from 'cors';

const app = express();

app.use(
	cors({
		origin: 'http://localhost:5173', // Specify the frontend origin
		credentials: true, // Allow cookies to be sent
	})
);

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Welcome to Internship Portal');
});

export default app;
