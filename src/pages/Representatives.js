import { useEffect, useState } from "react";
import { SenatorRow } from "../components/SenatorRow";
import { getHouseData } from "../utils/dataUtils"
import { createFullName, createWikipediaURL } from "../utils/stringUtils"

export const Representatives = () => {
	const [houseData, setHouseData] = useState([]);

	useEffect(() => {
		const getData = async () => {
			setHouseData(await getHouseData());
		};

		getData();
	}, []);

	return (
		<>
			<h1>Representative Data</h1>
			<h2>All Current and Past U.S. Representatives</h2>
			{Object.keys(houseData).map( (seat) => (
				<table key={seat} style={{ width: '1170px'}}>
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Birthday</th>
							<th>Gender</th>
							<th>State</th>
							<th>Class/ District</th>
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
					{houseData[seat].map( (rep) => (
						<tbody key={seat+rep.id.bioguide}>
							<SenatorRow
								bioguide={rep.id.bioguide}
								fullName={createFullName(
									rep.name.first || '',
									rep.name.nickname || '',
									rep.name.middle || '',
									rep.name.last || '',
									rep.name.suffix || ''
								)}
								birthday={rep.bio.birthday}
								gender={rep.bio.gender}
								terms={rep.terms}
								multipleSeats={rep.multipleSeats}
								wikipedia={rep.id.wikipedia && createWikipediaURL(rep.id.wikipedia)}
							/>
						</tbody>
					))}
				</table>
			))}
		</>
	)
};
	