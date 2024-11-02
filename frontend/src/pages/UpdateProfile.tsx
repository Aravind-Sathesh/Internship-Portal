import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	TextField,
	Button,
	Typography,
	Container,
	Paper,
} from '@mui/material';

const UpdateProfile = () => {
	const [profileData, setProfileData] = useState({
		email: '',
		studentId: '',
		name: '',
		phoneNumber: '',
		address: '',
		bitsId: '',
		photoUrl: '',
	});

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await fetch(
					'http://localhost:5000/auth/userinfo',
					{
						method: 'GET',
						credentials: 'include',
					}
				);
				const data = await response.json();
				setProfileData({
					email: data.user.email,
					studentId: `411${data.user.email.match(/\d+/)[0]}`,
					name: data.user.displayName,
					phoneNumber: '',
					address: '',
					bitsId: data.user.bitsId || '',
					photoUrl: data.user.photo,
				});
			} catch (error) {
				console.error('Error fetching profile data:', error);
			}
		};

		fetchProfileData();
	}, []);

	const handleProfileUpdate = (event: React.FormEvent) => {
		event.preventDefault();
		fetch('http://localhost:5000/student/initialize-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(profileData),
		})
			.then((response) => response.json())
			.then(() => {
				navigate('/student-dashboard');
			})
			.catch((error) => {
				console.error('Error updating profile:', error);
			});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfileData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<Container maxWidth='sm' sx={{ marginTop: 10 }}>
			<Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
				<Typography variant='h4' align='center' gutterBottom>
					Update Profile
				</Typography>
				<Box component='form' onSubmit={handleProfileUpdate}>
					<TextField
						label='Name'
						name='name'
						value={profileData.name || ''}
						onChange={handleChange}
						fullWidth
						margin='normal'
						variant='outlined'
						required
					/>
					<TextField
						label='Email'
						name='email'
						value={profileData.email || ''}
						fullWidth
						margin='normal'
						InputProps={{ readOnly: true }}
						variant='outlined'
						disabled
					/>
					<TextField
						label='ERP ID'
						name='studentId'
						value={profileData.studentId || ''}
						fullWidth
						margin='normal'
						InputProps={{ readOnly: true }}
						variant='outlined'
						disabled
					/>
					<TextField
						label='Phone Number'
						name='phoneNumber'
						value={profileData.phoneNumber || ''}
						onChange={handleChange}
						fullWidth
						margin='normal'
						variant='outlined'
					/>
					<TextField
						label='Address'
						name='address'
						value={profileData.address || ''}
						onChange={handleChange}
						fullWidth
						margin='normal'
						variant='outlined'
					/>
					<TextField
						label='BITS ID'
						name='bitsId'
						value={profileData.bitsId || ''}
						onChange={handleChange}
						fullWidth
						margin='normal'
						required
						variant='outlined'
					/>
					<Button
						variant='contained'
						color='primary'
						type='submit'
						fullWidth
						sx={{ marginTop: 2 }}
					>
						Save Changes
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default UpdateProfile;
