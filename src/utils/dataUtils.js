// Fetch request for raw congressional data
const getCongressData = async (when) => {
	let url = `https://theunitedstates.io/congress-legislators/legislators-${when}.json`;
	
	try {
		let res = await fetch(url);
		return await res.json();
	} catch (error) {
		console.log(error);
	};
}

// Combines historical and current congressional data together
const getAllCongressData = async () => {
	let historicalCongress = await getCongressData('historical');
	let currentCongress = await getCongressData('current');

	let allData = historicalCongress.concat(currentCongress);

	return allData;
}

// Filter the congress members into the chambers they served in. Senate, House, or both
const filterByChamber = (congressData, chamber) => {
	let senators = [];
	let representatives = [];
	let senAndRep = [];

	for( let i = 0; i < congressData.length; i++ ) {
		let wasSenator = false;
		let wasRepresentative = false;
		let congressPerson = congressData[i]
		let terms = congressPerson.terms;

		for( let j = 0; j < terms.length; j++ ) {
			let termChamber = terms[j].type;

			if( termChamber === 'sen' && wasSenator === false) {
				senators.push(congressPerson);
				wasSenator = true;
			} else if ( termChamber === 'rep' && wasRepresentative === false ) {
				representatives.push(congressPerson);
				wasRepresentative = true;
			}

			if ( wasSenator && wasRepresentative ) {
				senAndRep.push(congressPerson);
				break;
			}
		}
	}

	// Send back the requested chamber
	switch(chamber) {
		case 'senate':
			return senators;
		case 'house':
			return representatives;
		case 'both':
			return senAndRep;
		default:
			return null;
	}
}

// Leave only the terms served in either the Senate or House
const filterChamberTerms = (data, chamber) => {
	let filteredData = [];

	for( let i = 0; i < data.length; i++ ) {
		let congressPerson = data[i]
		let terms = congressPerson.terms;
		let filteredTerms = [];

		for( let j = 0; j < terms.length; j++ ) {
			let term = terms[j];
			let termChamber = term.type;

			if( termChamber === chamber) {
				filteredTerms.push(term)
			}
		}

		data[i].terms = filteredTerms;
		filteredData.push(data[i]);
	}

	return filteredData
}

// Create Senate seats and put Senators into those seats
const sortSenatorsToSeats = (senData) => {
	let senateSeats = {};

	for( let i = 0; i < senData.length; i++ ) {
		let senator = senData[i];
		let trackSeatIDs = {};

		for( let j = 0; j < senator.terms.length; j++ ) {
			let term = senator.terms[j];
			let seatID = term.state + term.class;

			// If the seat doesn't exist yet, add it
			if( !senateSeats[seatID]) {
				senateSeats[seatID] = [];
			}

			// Check if the senator was assigned to a seat, assign if not
			if( !trackSeatIDs[seatID]) {
				trackSeatIDs[seatID] = true;
				senateSeats[seatID].push(senator);
			}
		}
	}

	// Sort the seats alphabetically
	const sortedSeats = Object.keys(senateSeats)
		.sort()
		.reduce((accumulator, key) => {
			accumulator[key] = senateSeats[key];

			return accumulator;
		}, {});

	return sortedSeats;
}

// For each senator in a seat, only keep the terms they served in that seat
const filterSenatorSeatTerms = (senData) => {
	const sortedSenators = JSON.parse(JSON.stringify( senData ));

	for (let seat in sortedSenators) {
		let senatorsInSeat = sortedSenators[seat];

		for( let i = 0; i < senatorsInSeat.length; i++ ) {
			let senator = senatorsInSeat[i];
			let terms = senator.terms;
			let cleanedTerms = [];
			let multipleSeats = false;

			for( let j = 0; j < terms.length; j++ ) {
				let term = terms[j];
				let seatID = term.state + term.class;

				if( seatID === seat ) {
					cleanedTerms.push(term);
				} else if ( !multipleSeats ) {
					senatorsInSeat[i].multipleSeats = true;
					multipleSeats = true;
				}
			}

			senatorsInSeat[i].terms = cleanedTerms;
		}
	}

	return sortedSenators;
}

// Process the data for US Senators
export const getSenateData = async () => {
	return filterSenatorSeatTerms( sortSenatorsToSeats( filterChamberTerms( filterByChamber( await getAllCongressData(), 'senate'), 'sen')));
}