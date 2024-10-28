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
	TextField,
} from '@mui/material';

interface Application {
	studentId: number;
	role: string;
	studentName: string;
	status: string;
}

interface Role {
	role: String;
	description: String;
	applicationCount: number;
}

const EmployerDashboard = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [applications, setApplications] = useState<Application[]>([
		{
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

	const handleEdit = () => {
		setIsEditing(!isEditing);
		if (isEditing) {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		try {
			const payload = {
				name: employerProfile.name,
				email: employerProfile.email,
				phoneNumber: employerProfile.phoneNumber,
				address: employerProfile.address,
			};
			await fetch(
				`http://localhost:5000/employer/update-profile/${employerProfile.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			window.location.href = '/login';
		} catch (error) {
			console.error('Error updating profile:', error);
		}
		setIsEditing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEmployerProfile({ ...employerProfile, [name]: value });
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
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
									<TableRow key={app.studentId}>
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
												variant='contained'
												color='secondary'
												onClick={() =>
													handleDelete(app.studentId)
												}
											>
												Delete
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
								Employer Profile
							</Typography>
							<TextField
								label='Name'
								name='name'
								value={employerProfile.name}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: !isEditing }}
							/>
							<TextField
								label='Email'
								name='email'
								value={employerProfile.email}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: true }}
							/>
							<TextField
								label='Phone Number'
								name='phoneNumber'
								value={employerProfile.phoneNumber}
								variant='outlined'
								fullWidth
								margin='normal'
								onChange={handleChange}
								InputProps={{ readOnly: !isEditing }}
							/>
							<TextField
								label='Address'
								name='address'
								value={employerProfile.address}
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

export default EmployerDashboard;
