import React, { useEffect, useState } from 'react';

const TestConnection: React.FC = () => {
	const [message, setMessage] = useState<string>('Loading...');

	useEffect(() => {
		const checkConnection = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/test');
				const data = await response.text();
				setMessage(data);
			} catch (error) {
				console.error('Error connecting to backend:', error);
			}
		};
		checkConnection();
	}, []);

	return (
		<div>
			<h1>{message || 'Connecting...'}</h1>
		</div>
	);
};

export default TestConnection;
