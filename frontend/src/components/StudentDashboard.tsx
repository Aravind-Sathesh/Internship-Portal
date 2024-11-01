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
	Modal,
} from '@mui/material';
import Profile from './Profile';
import dayjs, { Dayjs } from 'dayjs';

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

interface Internship {
	internshipId: number;
	role: string;
	description: string;
	employer: string;
	deadline: Dayjs;
	EmployerId?: number;
	is_active: boolean;
}

const StudentDashboard = () => {
	const [applications, setApplications] = useState<Application[]>([]);
	const [userData, setUserData] = useState<UserData>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [internships, setInternships] = useState<Internship[]>([]);

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

	const fetchApplications = async () => {
		try {
			const email = userData?.email;
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

	useEffect(() => {
		if (!userData) return;

		fetchApplications();
	}, [userData]);

	const handleStatusChange = async (
		applicationId: number,
		newStatus: string
	) => {
		try {
			await fetch(`http://localhost:5000/applications/${applicationId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});
			setApplications(
				applications.map((app) =>
					app.id === applicationId
						? { ...app, status: newStatus }
						: app
				)
			);
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	const fetchInternships = async () => {
		try {
			const response = await fetch(
				'http://localhost:5000/internships/with-employers'
			);
			const data: Internship[] = await response.json();

			const parsedData = data.map((internship) => ({
				...internship,
				deadline: dayjs(internship.deadline),
			}));

			setInternships(parsedData);
		} catch (error) {
			console.error('Error fetching internships:', error);
		}
	};

	const handleApplyToInternship = async (internshipId: number) => {
		try {
			const studentId = userData?.id;
			const response = await fetch(
				`http://localhost:5000/applications/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ studentId, internshipId }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to apply for internship');
			}

			setIsModalOpen(false);
			await fetchApplications();
		} catch (error) {
			console.error('Error applying to internship:', error);
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
										<TableCell
											align='center'
											sx={{
												alignItems: 'center',
												display: 'flex',
												flexDirection: 'column',
											}}
										>
											{app.status === 'Offer Given' && (
												<Button
													onClick={() =>
														handleStatusChange(
															app.id,
															'Accepted'
														)
													}
													color='success'
													variant='contained'
													sx={{
														minWidth: '108px',
														maxWidth: '108px',
													}}
												>
													Accept
												</Button>
											)}
											<Button
												onClick={() =>
													handleStatusChange(
														app.id,
														'Withdrawn'
													)
												}
												disabled={[
													'Withdrawn',
													'Rejected',
													'Accepted',
												].includes(app.status)}
												color='error'
												sx={{
													minWidth: '108px',
													maxWidth: '108px',
												}}
											>
												Withdraw
											</Button>
										</TableCell>
									</TableRow>
								))}

								<TableRow
									onClick={() => {
										setIsModalOpen(true);
										fetchInternships();
									}}
									sx={{
										cursor: 'pointer',
										'&:hover': {
											backgroundColor: '#f5f5f5',
										},
									}}
								>
									<TableCell align='center' colSpan={4}>
										<Typography
											variant='body1'
											align='center'
											color='primary'
										>
											+ Apply for Internship
										</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Profile type='student' />
				</Grid>
			</Grid>

			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box
					sx={{
						width: '80vw',
						maxHeight: '80vh',
						overflowY: 'auto',
						margin: 'auto',
						mt: 10,
						bgcolor: 'background.paper',
						padding: 3,
						boxShadow: 24,
					}}
				>
					<Typography variant='h6' align='center' mb={2}>
						Available Internships
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
									Description
								</TableCell>
								<TableCell
									align='center'
									sx={{
										fontWeight: 'bold',
										fontSize: '1rem',
									}}
								>
									Deadline
								</TableCell>
								<TableCell
									align='center'
									sx={{
										fontWeight: 'bold',
										fontSize: '1rem',
									}}
								>
									Action
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{internships.map((internship, key) => (
								<TableRow key={key}>
									<TableCell align='center'>
										{internship.employer}
									</TableCell>
									<TableCell align='center'>
										{internship.role}
									</TableCell>
									<TableCell align='center'>
										{internship.description}
									</TableCell>
									<TableCell align='center'>
										{internship.deadline
											.toDate()
											.toLocaleDateString()}
									</TableCell>
									<TableCell align='center'>
										<Button
											variant='contained'
											color='primary'
											onClick={() =>
												handleApplyToInternship(
													internship.internshipId
												)
											}
										>
											Apply
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Modal>
		</Box>
	);
};

export default StudentDashboard;
