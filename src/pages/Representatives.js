import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SenatorRow } from "../components/SenatorRow";
import { getHouseData } from "../utils/dataUtils"
import { createFullName, createWikipediaURL } from "../utils/stringUtils"
import { statesList } from "../data/states";

export const Representatives = () => {
	const { state } = useParams();
	const allStates = state.toUpperCase() === 'ALL';
	const [houseData, setHouseData] = useState([]);
	const hide = true;

	useEffect(() => {
		const getData = async () => {
			setHouseData(await getHouseData(state));
		};

		getData();
	}, [state]);

	return (
		<>
			<h1>Representative Data</h1>

			<div className={'linksBox'} >
				{Object.keys(statesList).map( (abbrv) => (
					<Link className={'stateLink'} key={abbrv} to={`/house/${abbrv}`} rel="noreferrer">{statesList[abbrv]}</Link>
				))}
			</div>

			<h2>All Current and Past U.S. Representatives {!allStates && `from ${statesList[state.toUpperCase()]}`} </h2>
			
			{Object.keys(houseData).map( (seat) => (
				<table key={seat} style={{ width: `${hide ? '45px' : '1170px'}`}}>
					<thead>
						<tr>
							{hide ? 
								<th>{seat}</th>
							: 
								<>
									{!allStates && <th>Image</th>}
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
								</>
							}
						</tr>
					</thead>
					{houseData[seat].map( (rep, index) => (
						<tbody key={seat+rep.id.bioguide}>
							<SenatorRow
								allStates={allStates}
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
								index={index}
								multipleSeats={rep.multipleSeats}
								wikipedia={rep.id.wikipedia && createWikipediaURL(rep.id.wikipedia)}
								numberOfReps={houseData[seat].length}
								currentRep={index}
								hidden={hide}
							/>
						</tbody>
					))}
				</table>
			))}
		</>
	)
};
	