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
	Snackbar,
	Alert,
} from '@mui/material';

const Login = () => {
	const [alert, setAlert] = useState({
		open: false,
		message: 'message',
	});
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
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

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
				'http://localhost:5001/employer/login',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				}
			);
			const data = await response.json();
			if (data.token) {
				sessionStorage.setItem('token', data.token);
				window.location.href = '/employer-dashboard';
			} else {
				setAlert({
					open: true,
					message: 'Login failed',
				});
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
			setAlert({
				open: true,
				message: "Passwords don't match",
			});
			return;
		}
		try {
			const response = await fetch(
				'http://localhost:5001/employer/register',
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
			if (data.employer) {
				handleTabChange(event, 0);
				setRegisterData({
					name: '',
					email: '',
					password: '',
					confirmPassword: '',
					address: '',
					phoneNumber: '',
				});
				setAlert({
					open: true,
					message: 'Registration successful. Proceed to login.',
				});
			} else {
				setAlert({
					open: true,
					message: data.message || 'Registration failed',
				});
			}
		} catch (error) {
			console.error('Error during registration:', error);
		}
	};

	const openForgotPassword = () => setForgotPasswordOpen(true);
	const closeForgotPassword = () => setForgotPasswordOpen(false);

	const handleSendResetLink = async () => {
		try {
			const response = await fetch(
				'http://localhost:5001/employer/send-password-reset-email',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: forgotPasswordEmail }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setAlert({
					open: true,
					message: errorData.message || 'Failed to send reset link',
				});
				return;
			}

			const data = await response.json();

			if (data.message) {
				setAlert({
					open: true,
					message: data.message,
				});
				closeForgotPassword();
			}
		} catch (error) {
			console.error('Error sending reset link:', error);
			setAlert({
				open: true,
				message: 'An error occurred while sending the reset link',
			});
		}
	};

	return (
		<>
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
								'http://localhost:5001/auth/google')
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

					{tabValue ? (
						<Grid container spacing={2} mt={0}>
							<Grid item xs={12}>
								<form onSubmit={handleEmployerRegister}>
									<TextField
										label='Company Name'
										name='name'
										value={registerData.name}
										onChange={handleInputChange}
										fullWidth
										required
										margin='normal'
									/>
									<TextField
										label='Email'
										name='email'
										type='email'
										value={registerData.email}
										onChange={handleInputChange}
										fullWidth
										required
										margin='normal'
									/>
									<TextField
										label='Password'
										name='password'
										type='password'
										value={registerData.password}
										onChange={handleInputChange}
										required
										fullWidth
										margin='normal'
									/>
									<TextField
										label='Confirm Password'
										name='confirmPassword'
										type='password'
										value={registerData.confirmPassword}
										onChange={handleInputChange}
										required
										fullWidth
										margin='normal'
									/>
									<TextField
										label='Address'
										name='address'
										value={registerData.address}
										onChange={handleInputChange}
										required
										fullWidth
										margin='normal'
									/>
									<TextField
										label='Phone Number'
										name='phoneNumber'
										value={registerData.phoneNumber}
										onChange={handleInputChange}
										required
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
					) : (
						<Grid container spacing={2} mt={0}>
							<Grid item xs={12}>
								<form onSubmit={handleEmployerLogin}>
									<TextField
										label='Email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
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

					<Modal
						open={forgotPasswordOpen}
						onClose={closeForgotPassword}
					>
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
								value={forgotPasswordEmail}
								onChange={(e) =>
									setForgotPasswordEmail(e.target.value)
								}
								autoComplete='email'
							/>
							<Button
								variant='contained'
								color='primary'
								onClick={handleSendResetLink}
								fullWidth
								style={{ marginTop: '1rem' }}
							>
								Send Reset Link
							</Button>
						</Box>
					</Modal>
				</Paper>
			</Box>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				onClose={() => setAlert({ ...alert, open: false })}
			>
				<Alert
					onClose={() => setAlert({ ...alert, open: false })}
					severity='info'
					variant='filled'
				>
					{alert.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Login;
