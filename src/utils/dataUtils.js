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

// Create Chamber seats and put Members into those seats
const sortMembersToSeats = (data, type) => {
	let chamberSeats = {};

	for( let i = 0; i < data.length; i++ ) {
		let member = data[i];
		let trackSeatIDs = {};

		for( let j = 0; j < member.terms.length; j++ ) {
			let term = member.terms[j];
			let seatID = `${term.state}${term[type].toString().length === 1 ? `0${term[type]}` : term[type]}`;

			// If the seat doesn't exist yet, add it
			if( !chamberSeats[seatID]) {
				chamberSeats[seatID] = [];
			}

			// Check if the member was assigned to a seat, assign if not
			if( !trackSeatIDs[seatID]) {
				trackSeatIDs[seatID] = true;
				chamberSeats[seatID].push(member);
			}
		}
	}

	// Sort the seats alphabetically
	const sortedSeats = Object.keys(chamberSeats)
		.sort()
		.reduce((accumulator, key) => {
			accumulator[key] = chamberSeats[key];

			return accumulator;
		}, {});

	return sortedSeats;
}

// For each Member in a seat, only keep the terms they served in that seat
const filterMemberSeatTerms = (data, type) => {
	const filteredSeats = JSON.parse(JSON.stringify( data ));

	for (let seat in filteredSeats) {
		let membersInSeat = filteredSeats[seat];

		for( let i = 0; i < membersInSeat.length; i++ ) {
			let member = membersInSeat[i];
			let terms = member.terms;
			let cleanedTerms = [];
			let multipleSeats = false;

			for( let j = 0; j < terms.length; j++ ) {
				let term = terms[j];
				let seatID = `${term.state}${term[type].toString().length === 1 ? `0${term[type]}` : term[type]}`;

				if( seatID === seat ) {
					cleanedTerms.push(term);
				} else if ( !multipleSeats ) {
					membersInSeat[i].multipleSeats = 'Yes';
					multipleSeats = true;
				}
			}

			membersInSeat[i].terms = cleanedTerms;
		}

		// Sort the terms by start date for better consistency
		const sortedTerms = membersInSeat.sort((a, b) => {
			return new Date( a.terms[0].start) - new Date( b.terms[0].start)
		});

		filteredSeats[seat] = sortedTerms;
	}

	return filteredSeats;
}

const filterByState = (data, state) => {
	let stateSeats = {};

	if( state.toUpperCase() !== 'ALL') {
		for( let seat in data ) {
			if( seat.substring(0,2) === state.toUpperCase() ) {
				stateSeats[seat] = data[seat];
			}
		}

		return stateSeats;
	} else {
		return data;
	}
}

// Process the data for US Senators
export const getSenateData = async () => {
	return filterMemberSeatTerms( sortMembersToSeats( filterChamberTerms( filterByChamber( await getAllCongressData(), 'senate'), 'sen'), 'class'), 'class');
}

// Process the data for US Representatives
export const getHouseData = async ( state ) => {
	return filterByState( filterMemberSeatTerms( sortMembersToSeats( filterChamberTerms( filterByChamber( await getAllCongressData(), 'house'), 'rep'), 'district'), 'district'), state);
}