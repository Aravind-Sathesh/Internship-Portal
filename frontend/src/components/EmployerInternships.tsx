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
	is_active: boolean;
	details: {
		salary: string;
		techStack: string[];
		academicRequirements: string;
		expandedJobDescription: string;
	};
}

const EmployerInternships: React.FC<{ employerId: number }> = ({
	employerId,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [newRole, setNewRole] = useState<{
		id?: number;
		role: string;
		description: string;
		employerId: number;
		deadline: Dayjs | null;
		is_active: boolean;
		details: {
			salary: string;
			techStack: string[];
			academicRequirements: string;
			expandedJobDescription: string;
		};
	}>({
		role: '',
		description: '',
		employerId: 0,
		deadline: dayjs(),
		is_active: true,
		details: {
			salary: '',
			techStack: [],
			academicRequirements: '',
			expandedJobDescription: '',
		},
	});

	// Fetch roles on employer profile load
	const fetchRoles = async () => {
		try {
			const response = await fetch(
				`http://localhost:5001/internships/by-employer/${employerId}`
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
			employerId: employerId,
		}));
	};

	useEffect(() => {
		fetchRoles();
	}, [employerId]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name.startsWith('details.')) {
			const key = name.split('.')[1];
			setNewRole((prevRole) => ({
				...prevRole,
				details: {
					...prevRole.details,
					[key]: value,
				},
			}));
		} else {
			setNewRole({ ...newRole, [name]: value });
		}
	};

	const handleDateChange = (date: Dayjs | null) => {
		setNewRole({ ...newRole, deadline: date });
	};

	const resetFields = () => {
		setSelectedRole(null);
		setNewRole({
			role: '',
			description: '',
			employerId: 0,
			deadline: dayjs(),
			is_active: true,
			details: {
				salary: '',
				techStack: [],
				academicRequirements: '',
				expandedJobDescription: '',
			},
		});
	};

	const handleSubmit = async () => {
		if (newRole.deadline && newRole.deadline.isAfter(dayjs())) {
			try {
				const roleToSubmit = {
					...newRole,
					deadline: newRole.deadline.format(),
					details: JSON.stringify(newRole.details),
				};

				if (isEditMode && selectedRole) {
					const response = await fetch(
						`http://localhost:5001/internships/${selectedRole.id}`,
						{
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(roleToSubmit),
						}
					);
					if (!response.ok) throw new Error('Failed to update role');
				} else {
					// POST request for creating new role
					const response = await fetch(
						'http://localhost:5001/internships',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(roleToSubmit),
						}
					);
					if (!response.ok) throw new Error('Failed to submit role');
				}

				setIsModalOpen(false);
				setIsEditMode(false);
				resetFields();
				fetchRoles();
			} catch (error) {
				console.error('Error submitting role:', error);
			}
		}
	};

	const handleApplicationEdit = (role: Role) => {
		setSelectedRole(role);
		setNewRole({
			id: role.id,
			role: role.role,
			description: role.description,
			employerId: employerId,
			deadline: role.deadline,
			is_active: role.is_active,
			details: role.details
				? typeof role.details === 'string'
					? JSON.parse(role.details)
					: role.details
				: {
						salary: '',
						techStack: [],
						academicRequirements: '',
						expandedJobDescription: '',
				  },
		});
		setIsEditMode(true);
		setIsModalOpen(true);
	};

	const handleDelete = async () => {
		if (isEditMode && selectedRole) {
			try {
				const response = await fetch(
					`http://localhost:5001/internships/${selectedRole.id}`,
					{
						method: 'DELETE',
					}
				);
				if (!response.ok) throw new Error('Failed to update role');
				setIsModalOpen(false);
				setIsEditMode(false);
				setSelectedRole(null);
				fetchRoles();
				setNewRole({
					role: '',
					description: '',
					employerId: 0,
					deadline: dayjs(),
					is_active: true,
					details: {
						salary: '',
						techStack: [],
						academicRequirements: '',
						expandedJobDescription: '',
					},
				});
			} catch (error) {
				console.error('Error deleting role:', error);
			}
		}
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
							resetFields();
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
					<TextField
						margin='normal'
						label='Salary'
						name='details.salary'
						fullWidth
						value={newRole.details.salary}
						onChange={handleInputChange}
					/>
					<TextField
						margin='normal'
						label='Tech Stack (comma-separated)'
						name='details.techStack'
						fullWidth
						value={newRole.details.techStack.join(', ')}
						onChange={(e) =>
							setNewRole({
								...newRole,
								details: {
									...newRole.details,
									techStack: e.target.value
										.split(',')
										.map((item) => item.trim()),
								},
							})
						}
					/>
					<TextField
						margin='normal'
						label='Academic Requirements'
						name='details.academicRequirements'
						fullWidth
						value={newRole.details.academicRequirements}
						onChange={handleInputChange}
					/>
					<TextField
						margin='normal'
						label='Expanded Job Description'
						name='details.expandedJobDescription'
						fullWidth
						multiline
						rows={4}
						value={newRole.details.expandedJobDescription}
						onChange={handleInputChange}
					/>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => setIsModalOpen(false)}
						color='primary'
					>
						Cancel
					</Button>
					{isEditMode && (
						<Button onClick={handleDelete} color='error'>
							Delete Internship
						</Button>
					)}
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
