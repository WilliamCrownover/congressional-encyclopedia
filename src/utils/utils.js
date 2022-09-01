const getCongress = async (when) => {
	let url = `https://theunitedstates.io/congress-legislators/legislators-${when}.json`
	
	try {
		let res = await fetch(url);
		return await res.json();
	} catch (error) {
		console.log(error);
	}
}

export const getFullCongress = async () => {
	let historical = await getCongress('historical');
	let current = await getCongress('current');

	let fullCongress = historical.concat(current);

	return fullCongress;
}

const filterByTerm = async (congress, chamber) => {
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

export const getSenators = async () => {
	return await filterByTerm(await getFullCongress(), 'senate');
}

export const createFullName = (f,n,m,l,s) => {
	return `${f}${n ? ` "${n}"` : ''} ${m} ${l} ${s}`.replace(/\s\s/g, ' ');
}

export const createWikipediaURL = (wiki) => {
	return `https://en.wikipedia.org/wiki/${wiki.replace(/\s/g, '_')}`
}