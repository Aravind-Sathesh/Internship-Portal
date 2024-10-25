import React from 'react';
import StudentDashboard from './StudentDashboard';
import EmployerDashboard from './EmployerDashboard';

interface DashboardProps {
	userType: 'student' | 'employer';
}

const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
	return userType === 'student' ? (
		<StudentDashboard />
	) : (
		<EmployerDashboard />
	);
};

export default Dashboard;
