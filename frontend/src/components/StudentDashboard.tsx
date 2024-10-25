import { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
} from '@mui/material';

interface Application {
	id: number;
	Internship: {
		role: string;
		Employer: {
			name: string;
		};
	};
	status: string;
}

const StudentDashboard = () => {
	const [applications, setApplications] = useState<Application[]>([]);

	useEffect(() => {
		const fetchApplications = async () => {
			const response = await fetch(
				'http://localhost:5000/auth/userinfo',
				{
					method: 'GET',
					credentials: 'include',
				}
			);
			const userData = await response.json();
			const studentId = `411${userData.user.email.match(/\d+/)[0]}`;

			const appResponse = await fetch(
				`http://localhost:5000/applications/student/${studentId}`
			);
			const data: Application[] = await appResponse.json();
			setApplications(data);
		};

		fetchApplications();
	}, []);

	const handleCancelApplication = async (id: number) => {
		await fetch(`http://localhost:5000/applications/${id}/cancel`, {
			method: 'POST',
		});
		setApplications(applications.filter((app) => app.id !== id));
	};

	const handleAcceptApplication = async (id: number) => {
		await fetch(`http://localhost:5000/applications/${id}/accept`, {
			method: 'POST',
		});
		setApplications(applications.filter((app) => app.id !== id));
	};

	return (
		<Box p={3}>
			<Typography variant='h5'>Your Applications</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Employer</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{applications.map((app) => (
						<TableRow key={app.id}>
							<TableCell>
								{app.Internship?.Employer?.name || 'N/A'}
							</TableCell>
							<TableCell>
								{app.Internship?.role || 'N/A'}
							</TableCell>
							<TableCell>{app.status}</TableCell>
							<TableCell>
								<Button
									onClick={() =>
										app.status === 'Offer Given'
											? handleAcceptApplication(app.id)
											: handleCancelApplication(app.id)
									}
									disabled={[
										'Cancelled',
										'Rejected',
										'Accepted',
									].includes(app.status)}
									color={
										app.status === 'Offer Given'
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
		</Box>
	);
};

export default StudentDashboard;
