import express from 'express';
import cors from 'cors';

const app = express();

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Welcome to Internship Portal');
});

export default app;
