import { useEffect, useState } from "react";
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';

export const SenatorRow = ({bioguide, fullName, birthday, gender, terms, multipleSeats, wikipedia}) => {
	const [image, setImage] = useState();
	const firstTerm = terms[0];
	const lastTerm = terms[terms.length - 1];
	const firstCongressDate = '1789-03-04'
	const cellWidthSmall = { width: '10px' };
	const cellWidthDate = { width: '90px' };
	const cellWidthDays = { width: '80px' };
	const cellWidthNames = { width: '230px' };
	const cellWidthParty = { width: '170px' };

	useEffect(() => {
		const getData = async () => {
			setImage(await bioImage(bioguide));
		};

		getData();
	}, [bioguide]);

	return (
		<tr>
			<td style={{ width: '10px' }}>
				<img 
					src={image} 
					alt={bioguide} 
					height='30' 
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src="https://bioguide.congress.gov/2b2b2e5c1b613f0aeb70f77accc91781-190.wp.jpg";
					}} 
				/>
			</td>
			<td style={cellWidthNames}>{fullName}</td>
			<td style={cellWidthDate}>{birthday && dateFormat(birthday)}</td>
			<td style={cellWidthSmall}>{gender}</td>
			<td style={cellWidthSmall}>{lastTerm.state}</td>
			<td style={cellWidthSmall}>{lastTerm.class}</td>
			<td style={cellWidthSmall}>{multipleSeats && 'Yes'}</td>
			<td style={cellWidthParty} className={`${lastTerm.party ? lastTerm.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty'}`} >{lastTerm.party}</td>
			<td style={cellWidthDate}>{dateFormat(firstTerm.start)}</td>
			<td style={cellWidthSmall}>{birthday && (calcDaysBetween(birthday, firstTerm.start) / 365).toFixed()}</td>
			<td style={cellWidthDate}>{dateFormat(lastTerm.end)}</td>
			<td style={cellWidthSmall}>{birthday && (calcDaysBetween(birthday, lastTerm.end) / 365).toFixed()}</td>
			<td style={cellWidthSmall}>{terms.length}</td>
			<td style={cellWidthDays}>{`${daysInOffice(terms)} Days`}</td>
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
			</td>
			
			<div style={{ display: 'flex', position: 'relative'}}>
				{terms.map( (term) => (
					<div key={`${term.state}${term.class}${term.start}`}>
						<div
							style={{ 
								position: 'absolute', 
								left: `0px`,
								width: `${calcDaysBetween(firstCongressDate, term.start)/100}px`,
								height: '32px',
								borderTop: '1px solid lightgrey',
								borderBottom: '1px solid lightgrey'
							}}
						/>
						<div 
							
							className={`alternatingColors ${term.party ? term.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty'}`}
							style={{ 
								position: 'absolute', 
								left: `${calcDaysBetween(firstCongressDate, term.start)/100}px`,
								width: `${calcDaysBetween(term.start, term.end)/100}px`,
								height: '32px'
							}}
						/>	
					</div>					
				))}
			</div>
		</tr>
	)
};