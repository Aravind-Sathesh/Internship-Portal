import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import UpdateProfile from './pages/UpdateProfile';
import Dashboard from './pages/Dashboard';
import InternshipDetails from './pages/InternshipDetails';
import ResetPassword from './pages/ResetPassword';

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
				<Route
					path='/internship-details/:id'
					element={<InternshipDetails />}
				/>
				<Route path='/reset-password' element={<ResetPassword />} />
			</Routes>
		</Router>
	);
};

export default App;
