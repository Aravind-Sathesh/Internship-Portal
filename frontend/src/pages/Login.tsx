import { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleEmployerLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(
				'http://localhost:5000/employer/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();
			if (data.token) {
				localStorage.setItem('token', data.token);
				window.location.href = '/employer-dashboard';
			} else {
				alert('Login failed');
			}
		} catch (error) {
			console.error('Error during login:', error);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = 'http://localhost:5000/auth/google';
	};

	return (
		<Box mt={5} p={3}>
			<Typography variant='h4' textAlign='center' mb={4}>
				Login
			</Typography>

			<Grid container spacing={4}>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6'>Employer Login</Typography>
					<form onSubmit={handleEmployerLogin}>
						<TextField
							label='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							fullWidth
							margin='normal'
							autoComplete='current-email'
						/>
						<TextField
							label='Password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							margin='normal'
							autoComplete='current-password'
						/>
						<Button
							variant='contained'
							color='primary'
							style={{ marginTop: '1rem' }}
							fullWidth
							type='submit'
						>
							Employer Login
						</Button>
					</form>
				</Grid>
				<Grid item xs={12} sm={6} textAlign='center'>
					<Typography variant='h6' mb={2}>
						Student Login
					</Typography>
					<Button
						variant='contained'
						color='primary'
						onClick={handleGoogleLogin}
						fullWidth
						style={{ height: '56px' }}
					>
						Login with Google
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Login;
