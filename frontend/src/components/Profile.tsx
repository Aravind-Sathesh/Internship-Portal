import { useState, useEffect } from 'react';
import {
	Button,
	Box,
	Typography,
	Paper,
	TextField,
	Snackbar,
	Alert,
	Modal,
	Avatar,
} from '@mui/material';

interface ProfileData {
	id: number;
	name: string;
	email: string;
	address: string;
	phoneNumber: string;
	bitsId?: string;
	photoUrl?: string;
}

const Profile: React.FC<{ type: 'student' | 'employer' }> = ({ type }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [profileImage, setProfileImage] = useState(
		profile?.photoUrl || 'default-google-image-url'
	);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				let url: string;
				const token = sessionStorage.getItem('token');
				let options: RequestInit;

				if (type === 'employer') {
					url = `http://localhost:5000/employer/profile`;
					options = {
						headers: {
							Authorization: `Bearer ${token}`,
						},
						credentials: 'same-origin',
					};
				} else {
					const userInfoResponse = await fetch(
						'http://localhost:5000/auth/userinfo',
						{
							method: 'GET',
							credentials: 'include',
						}
					);

					if (!userInfoResponse.ok) {
						throw new Error('Failed to fetch user info');
					}

					const userInfo = await userInfoResponse.json();
					const email = userInfo.user.email;

					url = `http://localhost:5000/student/profile/${email}`;
					options = {
						credentials: 'include',
					};
				}

				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${type} profile`);
				}

				const data = await response.json();
				setProfile(data);
				setProfileImage(data?.photoUrl);
			} catch (error) {
				console.error(`Error fetching ${type} profile:`, error);
			}
		};

		fetchProfile();
	}, [type]);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
		if (isEditing) handleSave();
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && profile) {
			setProfileImage(URL.createObjectURL(file));
			setUploadedFiles([file]);
		}
	};

	const handleSave = async () => {
		if (!profile) return;

		const formData = new FormData();
		formData.append('email', profile.email || '');
		formData.append('name', profile.name || '');
		formData.append('phoneNumber', profile.phoneNumber || '');
		formData.append('address', profile.address || '');
		if (type === 'student' && profile.bitsId) {
			formData.append('bitsId', profile.bitsId);
		}

		if (uploadedFiles.length > 0) {
			formData.append('file', uploadedFiles[0]);
		}

		const url = `http://localhost:5000/upload/update-profile/${type}/${profile.id}`;

		try {
			const response = await fetch(url, {
				method: 'PUT',
				body: formData,
				credentials: 'include',
			});
			if (response.ok) {
				const data = await response.json();
				const photoUrl =
					data.student?.photoUrl || data.employer?.photoUrl;
				setProfileImage(photoUrl);
				setProfile((prevProfile) =>
					prevProfile ? { ...prevProfile, photoUrl: photoUrl } : null
				);
				setSnackbarOpen(true);
			} else {
				console.error('Failed to save profile');
			}
		} catch (error) {
			console.error('Error saving profile:', error);
		}

		setIsEditing(false);
		setUploadedFiles([]);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (profile) {
			setProfile({ ...profile, [name]: value });
		}
	};

	const handleLogout = async () => {
		try {
			const response = await fetch('http://localhost:5000/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				window.location.href = '/login';
			} else {
				console.error('Failed to logout');
			}
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteConfirmText !== 'DELETE') return;

		try {
			const url = `http://localhost:5000/${type}/delete-profile/${profile?.id}`;
			const response = await fetch(url, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				window.location.href = '/';
			} else {
				console.error('Failed to delete account');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	};

	const handleDocUpload = async () => {
		const formData = new FormData();
		uploadedFiles.forEach((file, index) => {
			formData.append(`document${index + 1}`, file);
		});

		try {
			const response = await fetch(
				'http://localhost:5000/student/upload-documents',
				{
					method: 'POST',
					body: formData,
					credentials: 'include',
				}
			);
			if (response.ok) {
				console.log('Documents uploaded successfully');
				setDocUploadModalOpen(false);
			} else {
				console.error('Failed to upload documents');
			}
		} catch (error) {
			console.error('Error uploading documents:', error);
		}
	};

	return (
		<Paper
			elevation={3}
			sx={{
				padding: 2,
				height: 'calc(100vh - 11rem)',
				overflowY: 'auto',
			}}
		>
			<Box display='flex' flexDirection='column' alignItems='center'>
				<Typography variant='h5' align='center' mt={2} mb={3}>
					{`${type.charAt(0).toUpperCase() + type.slice(1)} Profile`}
				</Typography>

				{profile && (
					<>
						<Box
							display='flex'
							flexDirection='column'
							alignItems='center'
							justifyContent='center'
							mb={3}
						>
							<Avatar
								src={profileImage}
								alt='Profile'
								sx={{
									width: 80,
									height: 80,
									borderRadius: '50%',
									border: '2px solid #ccc',
								}}
							/>
							{isEditing && (
								<Button
									variant='contained'
									color='primary'
									component='label'
									sx={{ mt: 2 }}
									size='small'
								>
									Change Image
									<input
										type='file'
										id='profileImageUpload'
										accept='image/*'
										style={{ display: 'none' }}
										onChange={handleImageChange}
									/>
								</Button>
							)}
						</Box>
						<TextField
							name='name'
							label='Name'
							size='small'
							value={profile.name || ''}
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
							fullWidth
						/>
						<TextField
							name='email'
							label='Email'
							value={profile.email || ''}
							InputProps={{ readOnly: true }}
							size='small'
							fullWidth
							margin='normal'
						/>
						{type === 'student' && (
							<TextField
								name='bitsId'
								label='BITS ID'
								value={profile.bitsId || ''}
								InputProps={{ readOnly: true }}
								size='small'
								fullWidth
								margin='normal'
							/>
						)}
						<TextField
							name='address'
							size='small'
							label='Address'
							value={profile.address || ''}
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
							fullWidth
							margin='normal'
						/>
						<TextField
							name='phoneNumber'
							size='small'
							label='Phone Number'
							value={profile.phoneNumber || ''}
							onChange={handleChange}
							InputProps={{ readOnly: !isEditing }}
							fullWidth
							margin='normal'
						/>
					</>
				)}

				<Box
					mt={2}
					display='flex'
					flexDirection='column'
					gap='1rem'
					width='100%'
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<Button
							variant='contained'
							size='small'
							color='primary'
							onClick={handleEditToggle}
							sx={{ minWidth: '7rem' }}
						>
							{isEditing ? 'Save Profile' : 'Edit Profile'}
						</Button>
						<Button
							variant='contained'
							color='warning'
							size='small'
							onClick={handleLogout}
							sx={{ minWidth: '7rem' }}
						>
							Logout
						</Button>
					</div>
					{type === 'student' && (
						<Button
							size='small'
							variant='contained'
							color='success'
							onClick={() => setDocUploadModalOpen(true)}
						>
							My Documents
						</Button>
					)}
					<Button
						variant='contained'
						size='small'
						color='error'
						onClick={() => setModalOpen(true)}
					>
						Delete Account
					</Button>
				</Box>

				<Snackbar
					open={snackbarOpen}
					autoHideDuration={3000}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={() => setSnackbarOpen(false)}
				>
					<Alert
						onClose={() => setSnackbarOpen(false)}
						severity='success'
						variant='filled'
					>
						Profile saved successfully!
					</Alert>
				</Snackbar>

				<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 400,
							bgcolor: 'background.paper',
							boxShadow: 24,
							p: 4,
							borderRadius: '10px',
						}}
					>
						<Typography variant='h6' align='center' mb={2}>
							Confirm Account Deletion
						</Typography>
						<TextField
							variant='outlined'
							label='Type DELETE to confirm'
							fullWidth
							value={deleteConfirmText}
							onChange={(e) =>
								setDeleteConfirmText(e.target.value)
							}
						/>
						<Button
							fullWidth
							variant='contained'
							color='error'
							size='small'
							sx={{ mt: 2 }}
							onClick={handleDeleteAccount}
							disabled={deleteConfirmText !== 'DELETE'}
						>
							Delete Account
						</Button>
					</Box>
				</Modal>

				<Modal
					open={docUploadModalOpen}
					onClose={() => setDocUploadModalOpen(false)}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: { xs: '90%', sm: 400 },
							bgcolor: 'background.paper',
							boxShadow: 24,
							p: 4,
							borderRadius: '10px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Typography variant='h6' align='center' mb={1}>
							Upload Documents
						</Typography>
						<Typography
							variant='body2'
							align='center'
							mb={3}
							color='text.secondary'
						>
							Upload up to 3 documents (PDF, DOC, DOCX). The first
							document must be your CV.
						</Typography>

						<input
							type='file'
							accept='.pdf,.doc,.docx'
							multiple
							onChange={(e) => {
								if (e.target.files) {
									const filesArray = Array.from(
										e.target.files
									).slice(0, 3);

									// Check if the first file is a CV
									if (
										filesArray.length > 0 &&
										!filesArray[0].name
											.toLowerCase()
											.includes('cv')
									) {
										alert(
											'The first document must be your CV. Please upload it first.'
										);
										return; // Prevent further processing if CV is not first
									}

									setUploadedFiles(filesArray);
								}
							}}
							style={{ display: 'none' }} // Hide the default file input
							id='file-upload'
						/>
						<label htmlFor='file-upload'>
							<Button
								variant='outlined'
								component='span'
								size='small'
								color='primary'
								sx={{
									mt: 2,
									mb: 2,
									width: '100%',
									textTransform: 'capitalize',
								}}
							>
								Choose Files
							</Button>
						</label>

						<Box
							sx={{
								width: '100%',
								maxHeight: '120px',
								overflowY: 'auto',
								border: '1px dashed',
								borderColor: 'grey.400',
								borderRadius: '5px',
								p: 1,
								mb: 2,
							}}
						>
							{uploadedFiles.length > 0 ? (
								uploadedFiles.map((file, index) => (
									<Typography
										key={index}
										variant='body2'
										sx={{
											fontWeight:
												index === 0 ? 'bold' : 'normal',
											color:
												index === 0
													? 'primary.main'
													: 'inherit',
										}}
									>
										{file.name} {index === 0 && '(CV)'}
									</Typography>
								))
							) : (
								<Typography
									variant='body2'
									color='text.secondary'
									align='center'
								>
									No files selected
								</Typography>
							)}
						</Box>

						<Button
							fullWidth
							variant='contained'
							size='small'
							color='primary'
							sx={{ textTransform: 'capitalize' }}
							onClick={handleDocUpload}
						>
							Upload
						</Button>
					</Box>
				</Modal>
			</Box>
		</Paper>
	);
};

export default Profile;
