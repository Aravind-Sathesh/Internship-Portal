import { useEffect, useState } from 'react';

const Dashboard = () => {
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const response = await fetch(
					'http://localhost:5000/auth/userinfo',
					{
						method: 'GET',
						credentials: 'include',
					}
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}

				const data = await response.json();
				setUser(data.user);
			} catch (error) {
				console.error('Error fetching user info:', error);
			}
		};

		fetchUserInfo();
	}, []);

	return (
		<div>
			{user ? (
				<>
					<h2>Welcome, {user.displayName}</h2>
					<img
						src={user.photo}
						alt={`${user.displayName}'s profile`}
					/>
					<p>Email: {user.email}</p>
				</>
			) : (
				<p>Loading user information...</p>
			)}
		</div>
	);
};

export default Dashboard;
