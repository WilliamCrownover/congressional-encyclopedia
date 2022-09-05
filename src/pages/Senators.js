import { useEffect, useState } from "react";
import { SenatorRow } from "../components/SenatorRow";
import { getSenateData } from "../utils/dataUtils"
import { createFullName, createWikipediaURL } from "../utils/stringUtils"

export const Senators = () => {
	const [senateData, setSenateData] = useState([]);

	useEffect(() => {
		const getData = async () => {
			setSenateData(await getSenateData());
		};

		getData();
	}, []);

	return (
		<>
			<h1>Senator Data</h1>
			<h2>All Current and Past U.S. Senators</h2>
			{Object.keys(senateData).map( (seat) => (
				<table key={seat} style={{ width: '1600px'}}>
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Birthday</th>
							<th>Gender</th>
							<th>State</th>
							<th>Class</th>
							<th>Multiple Seats</th>
							<th>Party</th>
							<th>Term Start Date</th>
							<th>Age, Term Start</th>
							<th>Term End Date</th>
							<th>Age, Term End</th>
							<th>Num of Terms</th>
							<th>Days in Office</th>
							<th>Wiki</th>
						</tr>
					</thead>
					{senateData[seat].map( (senator) => (
						<tbody key={seat+senator.id.bioguide}>
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
								multipleSeats={senator.multipleSeats}
								wikipedia={createWikipediaURL(senator.id.wikipedia)}
							/>
						</tbody>
					))}
				</table>
			))}
		</>
	)
};
	