import { useState } from 'react';
import { Box, Button } from '@mui/material';
import ProfileForm from '../components/ProfileForm';

const StudentProfile = () => {
	const [profileData] = useState({
		email: 'f20200000@hyderabad.bits-pilani.ac.in',
		studentId: '41120200000',
		name: 'John Doe',
		phoneNumber: '',
		address: '',
		bitsId: '2020A7PS0000H',
		photoUrl: '',
	});

	const handleProfileUpdate = (updatedData: any) => {
		fetch('http://localhost:5000/student/update-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Profile updated:', data);
			})
			.catch((error) => {
				console.error('Error updating profile:', error);
			});
	};

	const handleProfileDelete = () => {
		fetch('http://localhost:5000/student/delete-profile', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: profileData.email }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Profile deleted:', data);
			})
			.catch((error) => {
				console.error('Error deleting profile:', error);
			});
	};

	return (
		<Box mt={5}>
			<ProfileForm
				initialData={profileData}
				readOnlyFields={false}
				onSubmit={handleProfileUpdate}
			/>
			<Button
				variant='contained'
				color='error'
				onClick={handleProfileDelete}
				fullWidth
			>
				Delete Profile
			</Button>
		</Box>
	);
};

export default StudentProfile;
