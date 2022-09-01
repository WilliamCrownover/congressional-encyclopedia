import { useEffect, useState } from "react";
import { SenatorCard } from "../components/SenatorCard";
import { getSenators, createFullName, createWikipediaURL } from "../utils/utils"

export const Senators = () => {
	const [fullCongress, setFullCongress] = useState([]);
	// console.log(fullCongress);

	useEffect(() => {
		const getData = async () => {
			setFullCongress(await getSenators());
		};

		getData();
	}, []);

	return (
		<>
			<h1>Senator Data</h1>
			<h2>All Current and Past U.S. Senators</h2>
			{fullCongress.map( (senator) => (
					<SenatorCard
						fullName={createFullName(
							senator.name.first || '',
							senator.name.nickname || '',
							senator.name.middle || '',
							senator.name.last || '',
							senator.name.suffix || ''
						)}
						birthday={senator.bio.birthday}
						gender={senator.bio.gender}
						terms={senator.terms}
						wikipedia={createWikipediaURL(senator.id.wikipedia)}
					/>
			))}
		</>
	)
}
	