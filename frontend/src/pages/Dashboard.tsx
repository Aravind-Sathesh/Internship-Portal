import React from 'react';
import StudentDashboard from '../components/StudentDashboard';
import EmployerDashboard from '../components/EmployerDashboard';

const Dashboard: React.FC<{ userType: 'student' | 'employer' }> = ({
	userType,
}) => {
	return userType === 'student' ? (
		<StudentDashboard />
	) : (
		<EmployerDashboard />
	);
};

export default Dashboard;
