import { useState, useEffect } from 'react';
import {
	Typography,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHead,
	Select,
	Button,
	MenuItem,
	Snackbar,
	Alert,
} from '@mui/material';

interface Application {
	id: number;
	studentId: number;
	role: string;
	studentName: string;
	status: string;
	internshipId: number;
	documents: string;
}

const EmployerApplications: React.FC<{ employerId: number }> = ({
	employerId,
}) => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [applications, setApplications] = useState<Application[]>([
		{
			id: 0,
			studentId: 0,
			role: 'N/A',
			studentName: 'N/A',
			status: '',
			internshipId: 0,
			documents: '',
		},
	]);

	const menuItems = [
		'Interview Scheduled',
		'Offer Given',
		'Rejected',
		'Accepted',
		'Withdrawn',
		'Applied',
	];

	const fetchApplications = async () => {
		try {
			const response = await fetch(
				`http://localhost:5001/applications/employer/${employerId}`
			);
			const data: Application[] = await response.json();
			setApplications(data);
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	useEffect(() => {
		fetchApplications();
	}, [employerId]);

	const handleStatusChange = async (
		applicationId: number,
		newStatus: string
	) => {
		try {
			await fetch(`http://localhost:5001/applications/${applicationId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});
			fetchApplications();
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	const handleView = (documentsList: string) => {
		const firstUrl = documentsList.split(',')[0];
		if (firstUrl === 'N/A') {
			alert('The student has not uploaded a CV');
		} else window.open(firstUrl, '_blank');
	};

	return (
		<>
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
						<TableRow
							key={app.id}
							sx={{
								'& .MuiTableCell-root': {
									color:
										app.status === 'Accepted'
											? 'success.light'
											: 'inherit',
								},
							}}
						>
							<TableCell align='center'>
								{app.studentId}
							</TableCell>
							<TableCell align='center'>
								{app.studentName}
							</TableCell>
							<TableCell align='center'>{app.role}</TableCell>
							<TableCell align='center'>
								<Select
									size='small'
									value={app.status}
									onChange={(e) =>
										handleStatusChange(
											app.id,
											e.target.value as string
										)
									}
									variant='outlined'
									sx={{ minWidth: '200px' }}
									disabled={app.status === 'Withdrawn'}
								>
									{menuItems.map((item, k) => (
										<MenuItem value={item} key={k}>
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
										handleView(app.documents as string)
									}
									disabled={app.status === 'Withdrawn'}
								>
									View CV
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
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
					Application Updated
				</Alert>
			</Snackbar>
		</>
	);
};

export default EmployerApplications;
