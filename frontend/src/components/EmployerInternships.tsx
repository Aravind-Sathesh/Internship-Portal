import { useState, useEffect } from 'react';
import {
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Role {
	id: number;
	role: string;
	description: string;
	applicationCount: number;
	deadline: Dayjs;
}

interface EmployerInternshipsProps {
	employeeId: number;
}

const EmployerInternships = ({ employeeId }: EmployerInternshipsProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null); // Track the role being edited
	const [newRole, setNewRole] = useState({
		role: '',
		description: '',
		employerId: 0,
		deadline: null as Dayjs | null,
	});

	// Fetch roles on employer profile load
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/internships/roles/${employeeId}`
				);
				const data: Role[] = await response.json();
				const rolesWithParsedDate = data.map((role: any) => ({
					...role,
					deadline: dayjs(role.deadline),
				}));
				setRoles(rolesWithParsedDate);
			} catch (error) {
				console.error('Error fetching roles:', error);
			}
			setNewRole((prevState) => ({
				...prevState,
				employerId: employeeId,
			}));
		};
		fetchRoles();
	}, [employeeId]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewRole({ ...newRole, [name]: value });
	};

	const handleDateChange = (date: Dayjs | null) => {
		setNewRole({ ...newRole, deadline: date });
	};

	const handleSubmit = async () => {
		if (newRole.deadline && newRole.deadline.isAfter(dayjs())) {
			try {
				if (isEditMode && selectedRole) {
					// PUT request for updating existing role
					const response = await fetch(
						`http://localhost:5000/internships/${selectedRole.id}`,
						{
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								...newRole,
								deadline: newRole.deadline.format(),
							}),
						}
					);
					if (!response.ok) throw new Error('Failed to update role');
				} else {
					// POST request for creating new role
					const response = await fetch(
						'http://localhost:5000/internships',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								...newRole,
								deadline: newRole.deadline.format(),
							}),
						}
					);
					if (!response.ok) throw new Error('Failed to submit role');
				}

				setIsModalOpen(false);
				setIsEditMode(false);
				setSelectedRole(null);
				const updatedRoles = await fetch(
					`http://localhost:5000/internships/roles/${employeeId}`
				);
				const rolesData: Role[] = await updatedRoles.json();
				const rolesWithParsedDate = rolesData.map((role: any) => ({
					...role,
					deadline: dayjs(role.deadline),
				}));
				setRoles(rolesWithParsedDate);
			} catch (error) {
				console.error('Error submitting role:', error);
			}
		}
	};

	const handleApplicationEdit = (role: Role) => {
		setSelectedRole(role);
		setNewRole({
			role: role.role,
			description: role.description,
			employerId: employeeId,
			deadline: role.deadline,
		});
		setIsEditMode(true);
		setIsModalOpen(true);
	};

	return (
		<>
			<Typography variant='h5' align='center' mt={2} mb={3}>
				Internships
			</Typography>
			<Table>
				<TableHead>
					<TableRow sx={{ backgroundColor: '#f5f5f5' }}>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', fontSize: '1rem' }}
						>
							Role
						</TableCell>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', fontSize: '1rem' }}
						>
							Description
						</TableCell>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', fontSize: '1rem' }}
						>
							Deadline
						</TableCell>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', fontSize: '1rem' }}
						>
							Applications
						</TableCell>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', fontSize: '1rem' }}
						>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{roles.map((role, key) => (
						<TableRow key={key}>
							<TableCell align='center'>{role.role}</TableCell>
							<TableCell align='center'>
								{role.description}
							</TableCell>
							<TableCell align='center'>
								{role.deadline.format('DD/MM/YYYY')}
							</TableCell>
							<TableCell align='center'>
								{role.applicationCount}
							</TableCell>
							<TableCell align='center'>
								<Button
									variant='outlined'
									color='primary'
									onClick={() => handleApplicationEdit(role)}
								>
									Edit
								</Button>
							</TableCell>
						</TableRow>
					))}
					<TableRow
						onClick={() => {
							setIsModalOpen(true);
							setIsEditMode(false);
						}}
						sx={{
							cursor: 'pointer',
							'&:hover': { backgroundColor: '#f5f5f5' },
						}}
					>
						<TableCell align='center' colSpan={5}>
							<Typography
								variant='body1'
								align='center'
								color='primary'
							>
								+ Add New Internship
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<DialogTitle>
					{isEditMode ? 'Edit Internship' : 'Add New Internship'}
				</DialogTitle>
				<DialogContent>
					<TextField
						margin='normal'
						label='Role'
						name='role'
						fullWidth
						required
						value={newRole.role}
						onChange={handleInputChange}
					/>
					<TextField
						margin='normal'
						label='Description'
						name='description'
						fullWidth
						value={newRole.description}
						onChange={handleInputChange}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label='Deadline'
							disablePast
							value={newRole.deadline}
							onChange={handleDateChange}
							format='DD/MM/YYYY'
							slotProps={{
								textField: {
									fullWidth: true,
									margin: 'normal',
								},
							}}
						/>
					</LocalizationProvider>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setIsModalOpen(false)}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						color='primary'
					>
						{isEditMode ? 'Update Internship' : 'Add Internship'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default EmployerInternships;
