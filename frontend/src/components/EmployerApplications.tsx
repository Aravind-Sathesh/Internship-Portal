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
	internshipId: number;
}

const EmployerApplications = ({ employeeId }: EmployerApplicationsProps) => {
	const [applications, setApplications] = useState<Application[]>([
		{
			id: 0,
			studentId: 0,
			role: 'N/A',
			studentName: 'N/A',
			status: '',
			internshipId: 0,
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
				`http://localhost:5000/applications/employer/${employeeId}`
			);
			const data: Application[] = await response.json();
			setApplications(data);
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	useEffect(() => {
		fetchApplications();
	}, [employeeId]);

	const handleStatusChange = async (
		applicationId: number,
		studentId: number,
		internshipId: number,
		newStatus: string
	) => {
		const payload = {
			studentId: studentId,
			internshipId: internshipId,
			status: newStatus,
		};

		try {
			await fetch(`http://localhost:5000/applications/${applicationId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			fetchApplications();
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
											app.studentId,
											app.internshipId,
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
									onClick={() => handleView(app.studentId)}
									disabled={app.status === 'Withdrawn'}
								>
									View
								</Button>
							</TableCell>
						</TableRow>
					))}
					;
				</TableBody>
			</Table>
		</>
	);
};

export default EmployerApplications;
