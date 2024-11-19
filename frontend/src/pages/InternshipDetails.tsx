import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Avatar,
	Stack,
	Divider,
	Snackbar,
	Alert,
} from '@mui/material';

interface InternshipDetailsProps {
	role: string;
	description: string;
	deadline: string;
	details: {
		salary: string;
		techStack: string[];
		academicRequirements: string;
		expandedJobDescription: string;
	};
}

interface EmployerProps {
	name: string;
	photoUrl: string;
}

const InternshipDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [studentId, setStudentId] = useState(0);
	const [internshipDetails, setInternshipDetails] =
		useState<InternshipDetailsProps | null>(null);
	const [employer, setEmployer] = useState<EmployerProps | null>(null);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});

	const fetchInternshipDetails = async () => {
		try {
			const response = await fetch(
				`http://localhost:5001/internships/expanded/${id}`
			);
			const data = await response.json();
			setInternshipDetails(data.internshipDetails);
			setEmployer(data.employer);
		} catch (error) {
			console.error('Error fetching internship details:', error);
		} finally {
			setStudentId(Number(sessionStorage.getItem('studentId')));
		}
	};

	const handleApplyToInternship = async (studentId: number) => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:5001/applications/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ studentId, internshipId: id }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to apply for internship');
			}

			setSnackbar({
				open: true,
				message: 'Successfully applied for internship!',
				severity: 'success',
			});
		} catch (error) {
			console.error('Error applying to internship:', error);
			setSnackbar({
				open: true,
				message: 'Failed to apply for internship',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInternshipDetails();
	}, [id]);

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const handleBack = () => {
		navigate('/student-dashboard');
	};

	return (
		<Box sx={{ maxWidth: '90%', mx: 'auto', mt: 6, p: 4 }}>
			<Button
				variant='outlined'
				color='primary'
				onClick={handleBack}
				sx={{ mb: 4 }}
			>
				Back to Dashboard
			</Button>
			{internshipDetails && employer ? (
				<Card sx={{ boxShadow: 4 }}>
					<CardContent>
						<Stack
							direction='row'
							alignItems='center'
							spacing={4}
							sx={{ mb: 3 }}
						>
							<Avatar
								src={employer.photoUrl}
								alt={employer.name}
								sx={{
									width: 80,
									height: 80,
									border: '2px solid #ccc',
								}}
							/>
							<Box>
								<Typography variant='h3' fontWeight='bold'>
									{internshipDetails.role}
								</Typography>
								<Typography
									variant='h6'
									color='text.secondary'
									sx={{ mt: 1 }}
								>
									by {employer.name}
								</Typography>
							</Box>
						</Stack>
						<Divider sx={{ mb: 4 }} />

						<Typography
							variant='h5'
							fontWeight='medium'
							gutterBottom
						>
							Description
						</Typography>
						<Typography variant='body1' paragraph>
							{internshipDetails.description}
						</Typography>

						<Typography
							variant='h5'
							fontWeight='medium'
							gutterBottom
						>
							Expanded Job Description
						</Typography>
						<Typography variant='body1' paragraph>
							{internshipDetails.details.expandedJobDescription}
						</Typography>

						<Box sx={{ mt: 4 }}>
							<Typography
								variant='h5'
								fontWeight='medium'
								gutterBottom
							>
								Details
							</Typography>
							<Box sx={{ pl: 2 }}>
								<Typography variant='subtitle1' gutterBottom>
									<strong>Salary:</strong>{' '}
									{internshipDetails.details.salary}
								</Typography>
								<Typography variant='subtitle1' gutterBottom>
									<strong>Tech Stack:</strong>{' '}
									{internshipDetails.details.techStack.join(
										', '
									)}
								</Typography>
								<Typography variant='subtitle1' gutterBottom>
									<strong>Academic Requirements:</strong>{' '}
									{
										internshipDetails.details
											.academicRequirements
									}
								</Typography>
								<Typography variant='subtitle1' gutterBottom>
									<strong>Application Deadline:</strong>{' '}
									{new Date(
										internshipDetails.deadline
									).toLocaleDateString()}
								</Typography>
							</Box>
						</Box>

						<Box
							sx={{
								mt: 5,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<Button
								variant='contained'
								color='primary'
								size='large'
								sx={{ width: '50%', py: 1.5 }}
								onClick={() =>
									handleApplyToInternship(studentId)
								}
							>
								{loading
									? 'Applying...'
									: 'Apply for this internship'}
							</Button>
						</Box>
					</CardContent>
				</Card>
			) : (
				<Typography variant='h6' color='text.secondary'>
					Internship details not available
				</Typography>
			)}

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default InternshipDetails;
