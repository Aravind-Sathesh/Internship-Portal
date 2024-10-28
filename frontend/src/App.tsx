import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import UpdateProfile from './pages/UpdateProfile';
import Dashboard from './components/Dashboard';
import StudentProfile from './pages/StudentProfile';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Navigate to='/login' replace />} />
				<Route path='/login' element={<Login />} />
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
