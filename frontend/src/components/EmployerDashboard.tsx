import { useState, useEffect } from 'react';
import {
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Button,
	Select,
	MenuItem,
} from '@mui/material';

interface Listing {
	id: number;
	role: string;
	applicant: string;
	status: string;
}

const EmployerDashboard = () => {
	const [listings, setListings] = useState<Listing[]>([]);

	useEffect(() => {
		fetch('http://localhost:5000/internships')
			.then((response) => response.json())
			.then((data: Listing[]) => {
				setListings(data);
			})
			.catch((error) => console.error('Error fetching listings:', error));
	}, []);

	const handleStatusChange = (listingId: number, newStatus: string) => {
		const updatedListings = listings.map((listing) =>
			listing.id === listingId
				? { ...listing, status: newStatus }
				: listing
		);
		setListings(updatedListings);

		fetch(`http://localhost:5000/applications/${listingId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status: newStatus }),
		}).catch((error) => console.error('Error updating status:', error));
	};

	const handleDelete = (listingId: number) => {
		fetch(`http://localhost:5000/internships/${listingId}`, {
			method: 'DELETE',
		})
			.then(() => {
				setListings(
					listings.filter((listing) => listing.id !== listingId)
				);
			})
			.catch((error) => console.error('Error deleting listing:', error));
	};

	return (
		<div>
			<h1>Employer Dashboard</h1>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Role</TableCell>
						<TableCell>Applicant</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{listings.map((listing) => (
						<TableRow key={listing.id}>
							<TableCell>{listing.role}</TableCell>
							<TableCell>{listing.applicant}</TableCell>
							<TableCell>
								<Select
									value={listing.status}
									onChange={(e) =>
										handleStatusChange(
											listing.id,
											e.target.value as string
										)
									}
								>
									<MenuItem value='Pending'>Pending</MenuItem>
									<MenuItem value='Approved'>
										Approved
									</MenuItem>
									<MenuItem value='Rejected'>
										Rejected
									</MenuItem>
								</Select>
							</TableCell>
							<TableCell>
								<Button
									variant='contained'
									color='secondary'
									onClick={() => handleDelete(listing.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default EmployerDashboard;
