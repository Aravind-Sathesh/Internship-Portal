import { useState, useEffect } from 'react';
import {
	Button,
	Box,
	Typography,
	Paper,
	TextField,
	Snackbar,
	Alert,
	Modal,
} from '@mui/material';

interface ProfileData {
	id: number;
	name: string;
	email: string;
	address: string;
	phoneNumber: string;
	bitsId?: number;
}

interface ProfileProps {
	type: 'student' | 'employer';
}

const Profile = ({ type }: ProfileProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				let url: string;
				const token = localStorage.getItem('token');
				let options: RequestInit;

				if (type === 'employer') {
					url = `http://localhost:5000/employer/profile`;
					options = {
						headers: {
							Authorization: `Bearer ${token}`,
						},
						credentials: 'same-origin',
					};
				} else {
					const userInfoResponse = await fetch(
						'http://localhost:5000/auth/userinfo',
						{
							method: 'GET',
							credentials: 'include',
						}
					);

					if (!userInfoResponse.ok) {
						throw new Error('Failed to fetch user info');
					}

					const userInfo = await userInfoResponse.json();
					const email = userInfo.user.email;

					url = `http://localhost:5000/student/profile/${email}`;
					options = {
						credentials: 'include',
					};
				}

				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${type} profile`);
				}

				const data = await response.json();
				setProfile(data);
			} catch (error) {
				console.error(`Error fetching ${type} profile:`, error);
			}
		};

		fetchProfile();
	}, [type]);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
		if (isEditing) handleSave();
	};

	const handleSave = async () => {
		if (!profile) return;

		const url = `http://localhost:5000/${type}/update-profile/${profile.id}`;

		try {
			await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(profile),
			});
			setIsEditing(false);
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Error saving profile:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (profile) {
			setProfile({ ...profile, [name]: value });
		}
	};

	const handleLogout = () => {
		if (type === 'employer') {
			localStorage.removeItem('token');
			window.location.href = '/login';
		} else if (type === 'student') {
			fetch('http://localhost:5000/logout', {
				method: 'POST',
				credentials: 'include',
			})
				.then((response) => {
					if (response.ok) {
						// Clear cookies
						document.cookie.split(';').forEach((cookie) => {
							document.cookie = cookie
								.replace(/^ +/, '')
								.replace(
									/=.*/,
									'=;expires=' +
										new Date(0).toUTCString() +
										';path=/'
								);
						});
						window.location.href = '/login';
					} else {
						console.error('Logout failed');
					}
				})
				.catch((error) => console.error('Error during logout:', error));
		} else {
			console.error('Invalid user type');
		}
	};

	const handleDeleteAccount = async () => {
		try {
			await fetch(
				`http://localhost:5000/${type}/delete-profile/${profile?.id}`,
				{
					method: 'DELETE',
					credentials: 'include',
				}
			);
			// window.location.href = '/login';
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	};

	const openDeleteModal = () => {
		setModalOpen(true);
	};

	return (
		<Paper
			elevation={3}
			sx={{
				padding: 2,
				height: 'calc(100vh - 11rem)',
				overflowY: 'auto',
			}}
		>
			<Box display='flex' flexDirection='column' alignItems='center'>
				<Typography variant='h5' align='center' mt={2} mb={3}>
					{`${type.charAt(0).toUpperCase() + type.slice(1)} Profile`}
				</Typography>

				{profile && (
					<>
						<TextField
							label='Name'
							name='name'
							value={profile.name}
							fullWidth
							margin='normal'
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
						/>
						<TextField
							label='Email'
							name='email'
							value={profile.email}
							fullWidth
							margin='normal'
							InputProps={{ readOnly: true }}
						/>
						<TextField
							label='Phone Number'
							name='phoneNumber'
							value={profile.phoneNumber || ''}
							fullWidth
							margin='normal'
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
						/>
						<TextField
							label='Address'
							name='address'
							value={profile.address || ''}
							fullWidth
							margin='normal'
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
						/>
					</>
				)}

				<Box mt={2} display='flex' flexDirection='column' gap='1rem'>
					<Button
						variant='contained'
						color='primary'
						onClick={handleEditToggle}
					>
						{isEditing ? 'Save' : 'Edit'}
					</Button>
					<Button
						variant='contained'
						color='error'
						onClick={handleLogout}
					>
						Logout
					</Button>
					<Button
						variant='contained'
						color='warning'
						onClick={openDeleteModal}
					>
						Delete Account
					</Button>
				</Box>

				<Snackbar
					open={snackbarOpen}
					autoHideDuration={5000}
					onClose={() => setSnackbarOpen(false)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				>
					<Alert
						onClose={() => setSnackbarOpen(false)}
						severity='success'
						variant='filled'
						sx={{ width: '15rem' }}
					>
						Profile Updated
					</Alert>
				</Snackbar>

				<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 400,
							bgcolor: 'background.paper',
							boxShadow: 24,
							p: 4,
							borderRadius: '10px',
						}}
					>
						<Typography variant='h6' align='center' mb={2}>
							Confirm Account Deletion
						</Typography>
						<Typography variant='body2' align='center' mb={3}>
							To confirm, please type "DELETE" below and press
							Delete.
						</Typography>
						<TextField
							fullWidth
							variant='outlined'
							label='Type DELETE to confirm'
							value={deleteConfirmText}
							onChange={(e) =>
								setDeleteConfirmText(e.target.value)
							}
						/>
						<Button
							fullWidth
							variant='contained'
							color='error'
							disabled={deleteConfirmText !== 'DELETE'}
							onClick={handleDeleteAccount}
							sx={{ mt: 2 }}
						>
							Delete Account
						</Button>
					</Box>
				</Modal>
			</Box>
		</Paper>
	);
};

export default Profile;
