import { useState } from 'react';
import {
	TextField,
	Button,
	Box,
	Typography,
	Grid,
	Tab,
	Tabs,
	Modal,
	Paper,
} from '@mui/material';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [registerData, setRegisterData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		address: '',
		phoneNumber: '',
	});
	const [tabValue, setTabValue] = useState(0);
	const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegisterData({ ...registerData, [name]: value });
	};

	const handleEmployerLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(
				'http://localhost:5000/employer/login',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
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

	const handleEmployerRegister = async (event: React.FormEvent) => {
		event.preventDefault();
		const { name, email, password, confirmPassword, address, phoneNumber } =
			registerData;
		if (password !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		try {
			const response = await fetch(
				'http://localhost:5000/employer/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						email,
						password,
						address,
						phoneNumber,
					}),
				}
			);
			const data = await response.json();
			if (data.success) {
				alert('Registration successful. Proceed to login.');
				setTabValue(0);
			} else {
				alert(data.message || 'Registration failed');
			}
		} catch (error) {
			console.error('Error during registration:', error);
		}
	};

	const openForgotPassword = () => setForgotPasswordOpen(true);
	const closeForgotPassword = () => setForgotPasswordOpen(false);

	return (
		<Box
			mt={5}
			p={3}
			maxWidth='500px'
			mx='auto'
			display='flex'
			flexDirection='column'
			gap={3}
		>
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant='h4' textAlign='center' mb={3}>
					Student Login
				</Typography>
				<Button
					variant='contained'
					color='secondary'
					onClick={() =>
						(window.location.href =
							'http://localhost:5000/auth/google')
					}
					fullWidth
					style={{ height: '56px' }}
				>
					Login with Google
				</Button>
			</Paper>

			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant='h4' textAlign='center' mb={3}>
					Employer Login
				</Typography>

				<Tabs value={tabValue} onChange={handleTabChange} centered>
					<Tab label='Login' />
					<Tab label='Register' />
				</Tabs>

				{tabValue === 0 && (
					<Grid container spacing={2} mt={0}>
						<Grid item xs={12}>
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
									onChange={(e) =>
										setPassword(e.target.value)
									}
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
									Login
								</Button>
							</form>
						</Grid>
						<Grid item xs={12} textAlign='center'>
							<Button
								onClick={openForgotPassword}
								color='primary'
							>
								Forgot Password?
							</Button>
						</Grid>
					</Grid>
				)}

				{tabValue === 1 && (
					<Grid container spacing={2} mt={0}>
						<Grid item xs={12}>
							<form onSubmit={handleEmployerRegister}>
								<TextField
									label='Name'
									name='name'
									value={registerData.name}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Email'
									name='email'
									type='email'
									value={registerData.email}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Password'
									name='password'
									type='password'
									value={registerData.password}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Confirm Password'
									name='confirmPassword'
									type='password'
									value={registerData.confirmPassword}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Address'
									name='address'
									value={registerData.address}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Phone Number'
									name='phoneNumber'
									value={registerData.phoneNumber}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<Button
									variant='contained'
									color='primary'
									style={{ marginTop: '1rem' }}
									fullWidth
									type='submit'
								>
									Register
								</Button>
							</form>
						</Grid>
					</Grid>
				)}

				<Modal open={forgotPasswordOpen} onClose={closeForgotPassword}>
					<Box
						width='400px'
						bgcolor='background.paper'
						p={4}
						borderRadius='8px'
						boxShadow={24}
						mx='auto'
						mt={10}
					>
						<Typography variant='h6' mb={2}>
							Reset Password
						</Typography>
						<TextField
							label='Enter your email'
							fullWidth
							margin='normal'
						/>
						<Button
							variant='contained'
							color='primary'
							fullWidth
							style={{ marginTop: '1rem' }}
							onClick={() => alert('Password reset link sent')}
						>
							Send Reset Link
						</Button>
					</Box>
				</Modal>
			</Paper>
		</Box>
	);
};

export default Login;
