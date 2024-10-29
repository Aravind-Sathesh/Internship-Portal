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
} from '@mui/material';

interface EmployerApplicationsProps {
	employeeId: number;
}

interface Application {
	id: number;
	studentId: number;
	role: string;
	studentName: string;
	status: string;
}

const EmployerApplications = ({ employeeId }: EmployerApplicationsProps) => {
	const [applications, setApplications] = useState<Application[]>([
		{
			id: 0,
			studentId: 0,
			role: 'N/A',
			studentName: 'N/A',
			status: '',
		},
	]);

	const menuItems = [
		'Interview Scheduled',
		'Offer Given',
		'Rejected',
		'Accepted',
		'Withdrawn',
	];

	// Fetch applications by employer ID on page load
	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/applications/employer/${employeeId}`
				);
				const data: Application[] = await response.json();
				setApplications(data);
			} catch (error) {
				console.error('Error fetching applications:', error);
			}
		};

		fetchApplications();
	}, [employeeId]);

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

	const handleView = async (applicationId: number) => {
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
						<TableRow key={app.id}>
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
											app.studentId,
											e.target.value as string
										)
									}
									variant='outlined'
									sx={{ minWidth: '200px' }}
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
									onClick={() => handleView(app.studentId)}
								>
									View
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};

export default EmployerApplications;
