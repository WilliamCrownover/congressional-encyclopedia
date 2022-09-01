import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Senators } from './Senators';

export const PageRoutes = () => {

	return (
		<>
			<Router>
				<Routes>
					<Route exact path='/s' element={<Senators/>} />
				</Routes>
			</Router>
		</>
	);
}