import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface ProfileFormProps {
	initialData: {
		email?: string;
		studentId?: string;
		name?: string;
		phoneNumber?: string;
		address?: string;
		bitsId?: string;
		photoUrl?: string;
	};
	readOnlyFields?: boolean;
	onSubmit: (formData: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
	initialData,
	readOnlyFields = false,
	onSubmit,
}) => {
	const [formData, setFormData] = useState(initialData);

	useEffect(() => {
		setFormData(initialData);
	}, [initialData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Box mt={5} p={3}>
			<Typography variant='h5' mb={3}>
				{readOnlyFields ? 'Update Profile' : 'Edit Profile'}
			</Typography>
			<TextField
				label='Name'
				name='name'
				value={formData.name || ''}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Email'
				name='email'
				value={formData.email || ''}
				fullWidth
				margin='normal'
				InputProps={{ readOnly: true }}
			/>
			<TextField
				label='ERP ID'
				name='studentId'
				value={formData.studentId || ''}
				fullWidth
				margin='normal'
				InputProps={{ readOnly: true }}
			/>
			<TextField
				label='Phone Number'
				name='phoneNumber'
				value={formData.phoneNumber || ''}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Address'
				name='address'
				value={formData.address || ''}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='BITS ID'
				name='bitsId'
				value={formData.bitsId || ''}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			{!readOnlyFields && (
				<Button
					variant='contained'
					color='primary'
					onClick={handleSubmit}
					fullWidth
				>
					Save Changes
				</Button>
			)}
		</Box>
	);
};

export default ProfileForm;
