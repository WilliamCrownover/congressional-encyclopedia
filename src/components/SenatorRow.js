import { useEffect, useState } from "react";
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';

export const SenatorRow = ({bioguide, fullName, birthday, gender, terms, wikipedia}) => {
	const [image, setImage] = useState();

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
			<td>{terms[terms.length - 1].state}</td>
			<td>{terms[terms.length - 1].party}</td>
			<td>{dateFormat(terms[0].start)}</td>
			<td>{birthday && (calcDaysBetween(birthday, terms[0].start) / 365).toFixed()}</td>
			<td>{dateFormat(terms[terms.length - 1].end)}</td>
			<td>{birthday && (calcDaysBetween(birthday, terms[terms.length - 1].end) / 365).toFixed()}</td>
			<td>{terms.length}</td>
			<td>{`${daysInOffice(terms)} Days`}</td>
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
			</td>
		</tr>
	)
};