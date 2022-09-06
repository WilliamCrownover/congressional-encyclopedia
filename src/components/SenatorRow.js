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
	const cellWidthParty = { width: '180px' };

	useEffect(() => {
		const getData = async () => {
			setImage(await bioImage(bioguide));
		};

		getData();
	}, [bioguide]);

	return (
		<tr>
			{/* Image */}
			<td style={{ width: '10px' }}>
				{/* <img 
					src={image} 
					alt={bioguide} 
					height='30' 
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src="https://bioguide.congress.gov/2b2b2e5c1b613f0aeb70f77accc91781-190.wp.jpg";
					}} 
				/> */}
			</td>
			{/* Name */}
			<td style={cellWidthNames}>{fullName}</td>
			{/* Birthday */}
			<td style={cellWidthDate}>{birthday && dateFormat(birthday)}</td>
			{/* Gender */}
			<td style={cellWidthSmall} className={`${gender === 'M' ? 'male' : 'female'}`}>{gender}</td>
			{/* State */}
			<td style={cellWidthSmall}>{lastTerm.state}</td>
			{/* Class */}
			<td style={cellWidthSmall}>{lastTerm.class ? lastTerm.class : lastTerm.district}</td>
			{/* Multiple Seats */}
			<td style={cellWidthSmall} className={`${multipleSeats && 'multiseat'}`}>{multipleSeats && multipleSeats}</td>
			{/* Party */}
			<td style={cellWidthParty} className={`${lastTerm.party ? lastTerm.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty'}`} >{lastTerm.party}</td>
			{/* Term Start */}
			<td style={cellWidthDate}>{dateFormat(firstTerm.start)}</td>
			{/* Age at Term Start */}
			<td style={cellWidthSmall}>{birthday && (calcDaysBetween(birthday, firstTerm.start) / 365).toFixed()}</td>
			{/* Term End */}
			<td style={cellWidthDate}>{dateFormat(lastTerm.end)}</td>
			{/* Age at Term End */}
			<td style={cellWidthSmall}>{birthday && (calcDaysBetween(birthday, lastTerm.end) / 365).toFixed()}</td>
			{/* Number of Terms */}
			<td style={cellWidthSmall}>{terms.length}</td>
			{/* Days Served */}
			<td style={cellWidthDays}>{`${daysInOffice(terms)} Days`}</td>
			{/* Wikipedia Link */}
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wiki</a>
			</td>
			
			{/* Timeline */}
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