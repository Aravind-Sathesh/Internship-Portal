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
	Paper,
	Button,
} from '@mui/material';
import Profile from './Profile';

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
					<Profile type='student' />
				</Grid>
			</Grid>
		</Box>
	);
};

export default StudentDashboard;
