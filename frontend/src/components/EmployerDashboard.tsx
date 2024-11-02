import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

import Profile from './Profile';
import EmployerInternships from './EmployerInternships';
import EmployerApplications from './EmployerApplications';

const EmployerDashboard = () => {
	const [employerProfile, setEmployerProfile] = useState({
		id: 0,
		name: 'N / A',
		email: 'N / A',
		address: 'N / A',
		phoneNumber: 'N / A',
	});

	// Fetch employer details on login
	useEffect(() => {
		const fetchEmployerDetails = async () => {
			const token = sessionStorage.getItem('token');
			try {
				const response = await fetch(
					'http://localhost:5000/employer/profile',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) throw new Error('Failed to fetch profile');
				const data = await response.json();
				setEmployerProfile(data);
			} catch (error) {
				console.error('Error fetching employer details:', error);
				setEmployerProfile({
					id: 0,
					name: 'N / A',
					email: 'N / A',
					address: 'N / A',
					phoneNumber: 'N / A',
				});
			}
		};
		fetchEmployerDetails();
	}, []);

	return (
		<Box m={4}>
			<Typography align='center' variant='h4' mb={4}>
				Employer Dashboard
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={9}>
					<Paper
						elevation={3}
						sx={{
							padding: 2,
							height: 'calc(100vh - 11rem)',
							overflowY: 'auto',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<EmployerInternships employerId={employerProfile.id} />

						<EmployerApplications employerId={employerProfile.id} />
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Profile type='employer' />
				</Grid>
			</Grid>
		</Box>
	);
};

export default EmployerDashboard;
