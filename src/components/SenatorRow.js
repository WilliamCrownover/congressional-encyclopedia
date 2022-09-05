import { useEffect, useState } from "react";
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';

export const SenatorRow = ({bioguide, fullName, birthday, gender, terms, multipleSeats, wikipedia}) => {
	const [image, setImage] = useState();
	const firstTerm = terms[0];
	const lastTerm = terms[terms.length - 1];
	const firstCongressDate = '1789-03-04'

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
					height='35' 
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
			<td>{multipleSeats && 'Yes'}</td>
			<td className={`${lastTerm.party ? lastTerm.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty'}`} >{lastTerm.party}</td>
			<td>{dateFormat(firstTerm.start)}</td>
			<td>{birthday && (calcDaysBetween(birthday, firstTerm.start) / 365).toFixed()}</td>
			<td>{dateFormat(lastTerm.end)}</td>
			<td>{birthday && (calcDaysBetween(birthday, lastTerm.end) / 365).toFixed()}</td>
			<td>{terms.length}</td>
			<td>{`${daysInOffice(terms)} Days`}</td>
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
			</td>
			
			<div style={{ display: 'flex', position: 'relative'}}>
				{terms.map( (term) => (
					<div 
						key={`${term.state}${term.class}${term.start}`}
						className={`alternatingColors ${term.party ? term.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty'}`}
						style={{ 
							position: 'absolute', 
							left: `${calcDaysBetween(firstCongressDate, term.start)/50}px`,
							width: `${calcDaysBetween(term.start, term.end)/50}px`,
							height: '40px'
						}}
					/>						
				))}
			</div>
		</tr>
	)
};