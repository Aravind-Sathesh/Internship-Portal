import { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Grid,
	TableBody,
	TextField,
	Paper,
	Button,
} from '@mui/material';

interface Application {
	employer: string;
	id: number;
	role: string;
	status: string;
}

interface UserData {
	id: number;
	name: string;
	email: string;
	phoneNumber: string;
	address: string;
	bitsId: number;
}

const StudentDashboard = () => {
	const [applications, setApplications] = useState<Application[]>([]);
	const [userData, setUserData] = useState<UserData>();
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(
					'http://localhost:5000/auth/userinfo',
					{
						method: 'GET',
						credentials: 'include',
					}
				);
				if (!response.ok) {
					throw new Error('Failed to fetch user info');
				}

				const fetchedUserData = await response.json();

				const userProfile = await fetch(
					`http://localhost:5000/student/profile/${fetchedUserData.user.email}`
				);

				setUserData(await userProfile.json());
			} catch (error) {
				console.error('Error fetching user info:', error);
			}
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		if (!userData) return;

		const fetchApplications = async () => {
			try {
				const email = userData.email;
				if (!email) {
					console.error('Email not found in user data');
					return;
				}

				const match = email.match(/\d+/);
				if (!match) {
					console.error('No ID found in email');
					return;
				}

				const studentId = `411${match[0]}`;
				const appResponse = await fetch(
					`http://localhost:5000/applications/student/${studentId}`
				);
				if (!appResponse.ok) {
					throw new Error('Failed to fetch applications');
				}

				const data: Application[] = await appResponse.json();
				setApplications(data);
			} catch (error) {
				console.error('Error fetching applications:', error);
			}
		};

		fetchApplications();
	}, [userData]);

	const handleCancelApplication = async (id: number) => {
		try {
			await fetch(`http://localhost:5000/applications/${id}/cancel`, {
				method: 'POST',
			});
			setApplications(applications.filter((app) => app.id !== id));
		} catch (error) {
			console.error('Error cancelling application:', error);
		}
	};

	const handleAcceptApplication = async (id: number) => {
		try {
			await fetch(`http://localhost:5000/applications/${id}/accept`, {
				method: 'POST',
			});
			setApplications(
				applications.map((app) =>
					app.id === id ? { ...app, status: 'Accepted' } : app
				)
			);
		} catch (error) {
			console.error('Error accepting application:', error);
		}
	};

	const handleEdit = () => {
		setIsEditing(!isEditing);
		if (isEditing) {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		if (!userData) return;

		try {
			const payload = {
				name: userData.name,
				email: userData.email,
				phoneNumber: userData.phoneNumber,
				address: userData.address,
			};
			console.log(payload);
			console.log(userData);
			await fetch(
				`http://localhost:5000/student/profile/${userData.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
		setIsEditing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (userData) {
			setUserData({ ...userData, [name]: value });
		}
	};

	const handleLogout = () => {
		fetch('http://localhost:5000/logout', {
			method: 'POST',
			credentials: 'include',
		})
			.then((response) => {
				if (response.ok) {
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
	};

	return (
		<Box m={4}>
			<Typography align='center' variant='h4' mb={4}>
				Student Dashboard
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={9}>
					<Paper
						elevation={3}
						sx={{
							padding: 2,
							height: 'calc(100vh - 11rem)',
							overflowY: 'auto',
						}}
					>
						<Typography variant='h5' align='center' mt={2} mb={3}>
							Your Applications
						</Typography>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: '#f5f5f5' }}>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Employer
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Role
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Status
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{applications.map((app) => (
									<TableRow key={app.id}>
										<TableCell align='center'>
											{app.employer || 'N/A'}
										</TableCell>
										<TableCell align='center'>
											{app.role || 'N/A'}
										</TableCell>
										<TableCell align='center'>
											{app.status}
										</TableCell>
										<TableCell align='center'>
											<Button
												onClick={() =>
													app.status === 'Offer Given'
														? handleAcceptApplication(
																app.id
														  )
														: handleCancelApplication(
																app.id
														  )
												}
												disabled={[
													'Cancelled',
													'Rejected',
													'Accepted',
												].includes(app.status)}
												color={
													app.status ===
														'Offer Given' ||
													app.status === 'Accepted'
														? 'success'
														: 'error'
												}
											>
												{app.status === 'Offer Given' ||
												app.status === 'Accepted'
													? 'Accept'
													: 'Cancel'}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Paper
						elevation={3}
						sx={{
							padding: 2,
							height: 'calc(100vh - 11rem)',
							overflowY: 'auto',
						}}
					>
						<Box
							display='flex'
							flexDirection='column'
							alignItems='center'
							justifyContent='center'
						>
							<Typography
								variant='h5'
								align='center'
								mt={2}
								mb={3}
							>
								Student Profile
							</Typography>
							<TextField
								label='Name'
								name='name'
								value={userData?.name || ''}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: !isEditing }}
							/>
							<TextField
								label='Email'
								name='email'
								value={userData?.email || ''}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: true }}
							/>
							<TextField
								label='Phone Number'
								name='phoneNumber'
								value={userData?.phoneNumber || ''}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: !isEditing }}
							/>
							<TextField
								label='Address'
								name='address'
								value={userData?.address || ''}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: !isEditing }}
							/>
							<Box
								mt={2}
								display='flex'
								flexDirection='column'
								gap='1rem'
							>
								<Button
									variant='contained'
									color='primary'
									onClick={handleEdit}
									sx={{ minWidth: '160px' }}
								>
									{isEditing ? 'Submit' : 'Edit'}
								</Button>
								<Button
									variant='contained'
									color='error'
									onClick={handleLogout}
									sx={{ minWidth: '160px' }}
								>
									Logout
								</Button>
							</Box>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default StudentDashboard;
