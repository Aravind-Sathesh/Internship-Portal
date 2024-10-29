import { useState, useEffect } from 'react';
import {
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Button,
	Select,
	MenuItem,
	Box,
	Typography,
	Grid,
	Paper,
} from '@mui/material';
import Profile from './Profile';

interface Application {
	id: number;
	studentId: number;
	role: string;
	studentName: string;
	status: string;
}

interface Role {
	id: number;
	role: String;
	description: String;
	applicationCount: number;
}

const EmployerDashboard = () => {
	const [applications, setApplications] = useState<Application[]>([
		{
			id: 0,
			studentId: 0,
			role: 'N/A',
			studentName: 'N/A',
			status: '',
		},
	]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [employerProfile, setEmployerProfile] = useState({
		id: 0,
		name: 'N / A',
		email: 'N / A',
		address: 'N / A',
		phoneNumber: 'N / A',
	});
	const menuItems = [
		'Applied',
		'Under Review',
		'Interview Scheduled',
		'Offer Given',
		'Rejected',
		'Cancelled',
		'Accepted',
	];

	// Fetch employer details on login
	useEffect(() => {
		const fetchEmployerDetails = async () => {
			const token = localStorage.getItem('token');
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

	// Fetch roles on page load
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/internships/roles/${employerProfile.id}`
				);
				const data: Role[] = await response.json();
				setRoles(data);
			} catch (error) {
				console.error('Error fetching roles:', error);
			}
		};

		fetchRoles();
	}, [employerProfile]);

	// Fetch applications by employer ID on page load
	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/applications/employer/${employerProfile.id}`
				);
				const data: Application[] = await response.json();
				setApplications(data);
			} catch (error) {
				console.error('Error fetching applications:', error);
			}
		};

		fetchApplications();
	}, [employerProfile]);

	const handleStatusChange = async (
		applicationId: number,
		newStatus: string
	) => {
		const updatedApplications = applications.map((app) =>
			app.studentId === applicationId
				? { ...app, status: newStatus }
				: app
		);
		setApplications(updatedApplications);

		try {
			await fetch(`http://localhost:5000/applications/${applicationId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	const handleApplicationEdit = (id: number) => {
		// console.log(id);
	};

	const handleDelete = async (applicationId: number) => {
		try {
			await fetch(`http://localhost:5000/applications/${applicationId}`, {
				method: 'DELETE',
			});
			setApplications(
				applications.filter((app) => app.studentId !== applicationId)
			);
		} catch (error) {
			console.error('Error deleting application:', error);
		}
	};
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
						}}
					>
						<Typography variant='h5' align='center' mt={2} mb={3}>
							Roles
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
										Role
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Description
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Applications
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
								{roles.map((role, key) => (
									<TableRow key={key}>
										<TableCell align='center'>
											{role.role}
										</TableCell>
										<TableCell align='center'>
											{role.description}
										</TableCell>
										<TableCell align='center'>
											{role.applicationCount}
										</TableCell>
										<TableCell align='center'>
											<Button
												variant='contained'
												color='primary'
												onClick={() =>
													handleApplicationEdit(
														role.id
													)
												}
											>
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Typography variant='h5' align='center' mt={2} mb={3}>
							Applications
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
										Student ID
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											fontSize: '1rem',
										}}
									>
										Applicant
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
											{app.studentId}
										</TableCell>
										<TableCell align='center'>
											{app.studentName}
										</TableCell>
										<TableCell align='center'>
											{app.role}
										</TableCell>
										<TableCell align='center'>
											<Select
												size='small'
												value={app.status}
												onChange={(e) =>
													handleStatusChange(
														app.studentId,
														e.target.value as string
													)
												}
												variant='outlined'
												sx={{ minWidth: '200px' }}
											>
												{menuItems.map((item, k) => (
													<MenuItem
														value={item}
														key={k}
													>
														{item}
													</MenuItem>
												))}
											</Select>
										</TableCell>
										<TableCell align='center'>
											<Button
												variant='outlined'
												color='success'
												onClick={() =>
													handleDelete(app.studentId)
												}
											>
												View
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
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
