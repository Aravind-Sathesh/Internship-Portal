import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestConnection from './TestConnection';
import Dashboard from './Dashboard';

function App() {
	const handleLogin = () => {
		window.location.href = 'http://localhost:5000/auth/google';
	};

	return (
		<Router>
			<div className='App'>
				<Routes>
					<Route
						path='/'
						element={
							<div>
								<h2>Welcome to Internship Portal</h2>
								<TestConnection />
								<button onClick={handleLogin}>
									Login with Google
								</button>
							</div>
						}
					/>
					<Route path='/dashboard' element={<Dashboard />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
