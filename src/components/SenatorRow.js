import { useEffect, useState } from "react";
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';

export const SenatorRow = ({bioguide, fullName, birthday, gender, terms, wikipedia}) => {
	const [image, setImage] = useState();
	const firstTerm = terms[0];
	const lastTerm = terms[terms.length - 1];

	useEffect(() => {
		const getData = async () => {
			setImage(await bioImage(bioguide));
		};

		getData();
	}, [bioguide]);

	return (
		<tr>
			<td>
				<img 
					src={image} 
					alt={bioguide} 
					height='70' 
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src="https://bioguide.congress.gov/2b2b2e5c1b613f0aeb70f77accc91781-190.wp.jpg";
					}} 
				/>
			</td>
			<td>{fullName}</td>
			<td>{birthday && dateFormat(birthday)}</td>
			<td>{gender}</td>
			<td>{lastTerm.state}</td>
			<td>{lastTerm.class}</td>
			<td>{lastTerm.party}</td>
			<td>{dateFormat(firstTerm.start)}</td>
			<td>{birthday && (calcDaysBetween(birthday, firstTerm.start) / 365).toFixed()}</td>
			<td>{dateFormat(lastTerm.end)}</td>
			<td>{birthday && (calcDaysBetween(birthday, lastTerm.end) / 365).toFixed()}</td>
			<td>{terms.length}</td>
			<td>{`${daysInOffice(terms)} Days`}</td>
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
			</td>
		</tr>
	)
};