export const createFullName = (f,n,m,l,s) => {
	return `${f}${n ? ` "${n}"` : ''} ${m} ${l} ${s}`.replace(/\s\s/g, ' ');
}

export const createWikipediaURL = (wiki) => {
	return `https://en.wikipedia.org/wiki/${wiki.replace(/\s/g, '_')}`
}