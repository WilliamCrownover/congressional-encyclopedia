import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Senators } from './Senators';
import { Representatives } from './Representatives';

export const PageRoutes = () => {

	return (
		<>
			<Router>
				<Routes>
					<Route exact path='/senate' element={<Senators/>} />
					<Route path='/house/:state' element={<Representatives/>} />
				</Routes>
			</Router>
		</>
	);
}