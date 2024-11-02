import React, { useState, useEffect } from 'react';
import {
	Container,
	TextField,
	Button,
	Typography,
	Snackbar,
	Paper,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const emailParam = urlParams.get('email');
		const tokenParam = urlParams.get('token');

		if (emailParam) setEmail(emailParam);
		if (tokenParam) setToken(tokenParam);
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		if (newPassword !== confirmPassword) {
			setMessage('Passwords do not match. Please try again.');
			setOpen(true);
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				'http://localhost:5000/employer/reset-password',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, token, newPassword }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				setMessage(
					'Password reset successfully. You can now log in with your new password.'
				);
				window.location.href = '/login';
			} else {
				setMessage(data.message || 'Failed to reset password.');
			}
		} catch (error) {
			console.error('Error resetting password:', error);
			setMessage('An error occurred. Please try again.');
		} finally {
			setOpen(true);
			setLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Container maxWidth='sm' sx={{ marginTop: 18 }}>
			<Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
				<Typography variant='h4' align='center' gutterBottom>
					Reset Your Password
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label='Email'
						variant='outlined'
						margin='normal'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label='Reset Token'
						variant='outlined'
						margin='normal'
						value={token}
						onChange={(e) => setToken(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label='New Password'
						variant='outlined'
						type='password'
						margin='normal'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label='Confirm New Password' // New confirmation field
						variant='outlined'
						type='password'
						margin='normal'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						color='primary'
						type='submit'
						fullWidth
						disabled={loading}
						sx={{ padding: 1.5, my: 2 }}
					>
						{loading ? 'Resetting...' : 'Reset Password'}
					</Button>
				</form>
				<Snackbar
					open={open}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					autoHideDuration={6000}
					onClose={handleClose}
				>
					<Alert
						onClose={handleClose}
						severity={
							message.includes('successfully')
								? 'success'
								: 'error'
						}
						sx={{ width: '100%' }}
						variant='filled'
					>
						{message}
					</Alert>
				</Snackbar>
			</Paper>
		</Container>
	);
};

export default ResetPassword;
