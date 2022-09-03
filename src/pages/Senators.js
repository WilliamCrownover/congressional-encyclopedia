import { useEffect, useState } from "react";
import { SenatorRow } from "../components/SenatorRow";
import { getSenators, createFullName, createWikipediaURL } from "../utils/utils"

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
			<h2>All Current and Past U.S. Senators</h2>
			<table>
				<tr>
					<th>Image</th>
					<th>Name</th>
					<th>Birthday</th>
					<th>Gender</th>
					<th>State</th>
					<th>Party</th>
					<th>Age, Term Start</th>
					<th>Age, Term End</th>
					<th>Num of Terms</th>
					<th>Days in Office</th>
					<th>Wiki</th>
				</tr>
				{fullCongress.map( (senator) => (
						<SenatorRow
							bioguide={senator.id.bioguide}
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
			</table>
		</>
	)
};
	