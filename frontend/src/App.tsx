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
								<h1>Welcome to Internship Portal</h1>
								<TestConnection />
								<button
									onClick={handleLogin}
									style={{
										padding: '10px',
										backgroundColor: '#4285F4',
										color: '#fff',
										border: 'none',
										borderRadius: '5px',
										cursor: 'pointer',
									}}
								>
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
