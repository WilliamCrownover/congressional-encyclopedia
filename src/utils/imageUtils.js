export const checkImage = async (url) => {
     
	const res = await fetch(url);
	const buff = await res.blob();
   
	return buff.type.startsWith('image/')

}

export const bioImage = (bID) => {
	const firstLetter = bID.charAt(0);
	const bioImage = `https://bioguide.congress.gov/bioguide/photo/${firstLetter}/${bID}.jpg`;

	return bioImage
}