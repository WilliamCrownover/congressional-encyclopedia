import { useEffect, useState } from "react";
import { getSenators } from "../utils/utils"

export const Senators = () => {
	const [fullCongress, setFullCongress] = useState([]);

	useEffect(() => {
		const getData = async () => {
			setFullCongress(await getSenators());
		};

		getData();
	}, []);

	return (
		<>
			<h1>Senator Data</h1>
			<h2>{fullCongress?.length}</h2>
		</>
	)
}
	