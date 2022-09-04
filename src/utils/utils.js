const getCongressData = async (when) => {
	let url = `https://theunitedstates.io/congress-legislators/legislators-${when}.json`
	
	try {
		let res = await fetch(url);
		return await res.json();
	} catch (error) {
		console.log(error);
	}
}

const getAllCongressData = async () => {
	let historical = await getCongressData('historical');
	let current = await getCongressData('current');

	let allData = historical.concat(current);

	return allData;
}

const filterByChamber = (congress, chamber) => {
	let senators = [];
	let representatives = [];
	let senAndRep = [];

	for( let i = 0; i < congress.length; i++ ) {
		let wasSen = false;
		let wasRep = false;
		for( let j = 0; j < congress[i].terms.length; j++ ) {
			if( congress[i].terms[j].type === 'sen' && wasSen === false) {
				senators.push(congress[i]);
				wasSen = true;
			} else if ( congress[i].terms[j].type === 'rep' && wasRep === false ) {
				representatives.push(congress[i]);
				wasRep = true;
			}

			if ( wasSen && wasRep ) {
				senAndRep.push(congress[i]);
				break;
			}
		}
	}

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

const filterChamberTerms = (data, chamber) => {
	let filteredData = [];

	for( let i = 0; i < data.length; i++ ) {
		let terms = data[i].terms;
		let filteredTerms = [];

		for( let j = 0; j < terms.length; j++ ) {
			if( terms[j].type === chamber) {
				filteredTerms.push(terms[j])
			}
		}

		data[i].terms = filteredTerms;
		filteredData.push(data[i]);
	}

	return filteredData
}

export const getSenateData = async () => {
	return filterSenatorSeatTerms( sortSenatorsToSeats( filterChamberTerms( filterByChamber( await getAllCongressData(), 'senate'), 'sen')));
}

export const createFullName = (f,n,m,l,s) => {
	return `${f}${n ? ` "${n}"` : ''} ${m} ${l} ${s}`.replace(/\s\s/g, ' ');
}

export const createWikipediaURL = (wiki) => {
	return `https://en.wikipedia.org/wiki/${wiki.replace(/\s/g, '_')}`
}

export const sortSenatorsToSeats = (senData) => {
	
	let senateSeats = {};

	for( let i = 0; i < senData.length; i++ ) {
		let senator = senData[i];
		let trackSeatIDs = {};
		for( let j = 0; j < senator.terms.length; j++ ) {
			let term = senator.terms[j];
			let seatID = term.state + term.class;
			if( !senateSeats[seatID]) {
				senateSeats[seatID] = [];
			}
			if( !trackSeatIDs[seatID]) {
				trackSeatIDs[seatID] = true;
				senateSeats[seatID].push(senator);
			}
		}
	}

	const sortedSeats = Object.keys(senateSeats)
		.sort()
		.reduce((accumulator, key) => {
			accumulator[key] = senateSeats[key];

			return accumulator;
		}, {});

	return sortedSeats;
}

export const filterSenatorSeatTerms = (senData) => {
	const sortedSenators = JSON.parse(JSON.stringify( senData ));

	for (let seat in sortedSenators) {
		let senatorsInSeat = sortedSenators[seat];
		for( let i = 0; i < senatorsInSeat.length; i++ ) {
			let senatorInSeat = senatorsInSeat[i];
			let terms = senatorInSeat.terms;
			let cleanedTerms = [];
			for( let j = 0; j < terms.length; j++ ) {
				let term = terms[j];
				let seatID = term.state + term.class;
				if( seatID === seat ) {
					cleanedTerms.push(term);
				}
			}
			senatorsInSeat[i].terms = cleanedTerms;
		}
	}

	return sortedSenators;
}