const getCongress = async (when) => {
	let url = `https://theunitedstates.io/congress-legislators/legislators-${when}.json`
	
	try {
		let res = await fetch(url);
		return await res.json();
	} catch (error) {
		console.log(error);
	}
}

const getFullCongress = async () => {
	let historical = await getCongress('historical');
	let current = await getCongress('current');

	let fullCongress = historical.concat(current);

	return fullCongress;
}

const filterByTerm = (congress, chamber) => {
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

const removeRepTerms = (senData) => {
	let cleanedSenData = [];

	for( let i = 0; i < senData.length; i++ ) {
		let terms = senData[i].terms;
		let cleanedTerms = [];

		for( let j = 0; j < terms.length; j++ ) {
			if( terms[j].type === 'sen') {
				cleanedTerms.push(terms[j])
			}
		}

		senData[i].terms = cleanedTerms;
		cleanedSenData.push(senData[i]);
	}

	return cleanedSenData
}

export const getSenators = async () => {
	return removeRepTerms( filterByTerm( await getFullCongress(), 'senate'));
}

export const createFullName = (f,n,m,l,s) => {
	return `${f}${n ? ` "${n}"` : ''} ${m} ${l} ${s}`.replace(/\s\s/g, ' ');
}

export const createWikipediaURL = (wiki) => {
	return `https://en.wikipedia.org/wiki/${wiki.replace(/\s/g, '_')}`
}

export const sortSenateSeats = async () => {
	const rawSenators = await getSenators();
	let sortedSenators = {};

	for( let i = 0; i < rawSenators.length; i++ ) {
		let senator = rawSenators[i];
		let trackSeatIDs = {};
		for( let j = 0; j < senator.terms.length; j++ ) {
			let term = senator.terms[j];
			let seatID = term.state + term.class
			if( !sortedSenators[seatID]) {
				sortedSenators[seatID] = [];
			}
			if( !trackSeatIDs[seatID]) {
				trackSeatIDs[seatID] = true;
				sortedSenators[seatID].push(senator);
			}
		}
	}

	console.log('sortedSenators', sortedSenators);
	return sortedSenators;
}