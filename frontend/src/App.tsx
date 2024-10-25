import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'; // Unified login for students and employers
import UpdateProfile from './pages/UpdateProfile';
import Dashboard from './components/Dashboard';
import StudentProfile from './pages/StudentProfile';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route
					path='/student-dashboard'
					element={<Dashboard userType='student' />}
				/>
				<Route
					path='/employer-dashboard'
					element={<Dashboard userType='employer' />}
				/>
				<Route path='/update-profile' element={<UpdateProfile />} />
				<Route path='/student-profile' element={<StudentProfile />} />
			</Routes>
		</Router>
	);
};

export default App;
