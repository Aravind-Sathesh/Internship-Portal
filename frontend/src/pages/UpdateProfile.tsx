import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ProfileForm from '../components/ProfileForm';

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

	const handleProfileUpdate = (updatedData: any) => {
		fetch('http://localhost:5000/student/update-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Profile updated:', data);
				navigate('/student-dashboard');
			})
			.catch((error) => {
				console.error('Error updating profile:', error);
			});
	};

	return (
		<Box mt={5}>
			<ProfileForm
				initialData={profileData}
				readOnlyFields={false}
				onSubmit={handleProfileUpdate}
			/>
		</Box>
	);
};

export default UpdateProfile;
