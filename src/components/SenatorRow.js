import { useEffect, useState } from "react";
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';

export const SenatorRow = ({allStates, bioguide, fullName, birthday, gender, terms, index, multipleSeats, wikipedia, numberOfReps, currentRep, hidden}) => {
	const [image, setImage] = useState();
	const firstTerm = terms[0];
	const lastTerm = terms[terms.length - 1];
	const firstCongressDate = '1789-03-04';
	const hideSpacing = hidden ? 45 : 0;
	const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
	const widthMultiply = hidden ? windowWidth/92000 : 0.013;
	const cellWidthSmall = { width: '10px' };
	const cellWidthDate = { width: '90px' };
	const cellWidthDays = { width: '80px' };
	const cellWidthNames = { width: '230px' };
	const cellWidthParty = { width: '180px' };
	const timelineGridHeight = { height: `${hidden ? 35 : 35*(numberOfReps + 1)}px` };

	useEffect(() => {
		const getData = async () => {
			setImage(await bioImage(bioguide));
		};
		const handleResize = () => {
			setWindowWidth(document.documentElement.clientWidth);
		};

		getData();
		window.addEventListener('resize', handleResize);
	}, [bioguide]);

	const politicalPartyColor = (term) => {
		return term.party ? term.party.replace('.', '').replaceAll(' ', '').toLowerCase() : 'blankparty';
	}

	const timelineLeftPosition = (term) => {
		return calcDaysBetween(firstCongressDate, term.start)*widthMultiply;
	}

	const timelineTermWidth = (term) => {
		return calcDaysBetween(term.start, term.end)*widthMultiply;
	}

	return (
		<tr>
			{!hidden && 
				<>
					{/* Image */}
					{!allStates &&
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
					}
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
				</>
			}

			{/* Timeline */}
			<div className={'timelineContainer'} >
				{/* Timeline Grid */}
				{currentRep === 0 &&
					<>
						{[...Array(234)].map( (e, i ) => (
							<div 
								className={'timelineLine'}
								style={{
									left: `${365*i*widthMultiply + hideSpacing + 303*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(23*5+3)].map( (e, i ) => (
							<div 
								className={'timelineLineTerm'}
								style={{
									left: `${365*i*widthMultiply*2 + hideSpacing - 62*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(24)].map( (e, i ) => (
							<div 
								className={'timelineLineDecade'}
								style={{
									left: `${365*i*widthMultiply*10 + hideSpacing + 303*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(3)].map( (e, i ) => (
							<div 
								className={'timelineLineCentury'}
								style={{
									left: `${365*i*widthMultiply*100 + hideSpacing + 4017*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1812-06-18')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1812-06-18', '1815-02-17')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1835-10-02')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1835-10-02', '1836-04-21')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1846-04-25')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1846-04-25', '1848-02-02')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1861-04-12')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1861-04-12', '1865-04-09')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1898-04-21')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1898-04-21', '1898-08-13')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1917-04-06')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1917-04-06', '1918-11-11')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1941-12-11')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1941-12-11', '1945-09-02')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1950-06-25')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1950-06-25', '1953-07-27')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1955-11-01')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1955-11-01', '1975-04-30')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1990-08-02')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('1990-08-02', '1991-02-28')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '2001-11-07')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('2001-11-07', '2021-08-30')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'warLines'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '2003-03-20')*widthMultiply + hideSpacing}px`,
								width: `${calcDaysBetween('2003-03-20', '2011-12-15')*widthMultiply}px`,
								...timelineGridHeight
							}}
						/>
						<div
							className={'civilRightsAct'}
							style={{
								left: `${calcDaysBetween(firstCongressDate, '1964-07-02')*widthMultiply + hideSpacing}px`,
								...timelineGridHeight
							}}
						/>
					</>
				}
				{terms.map( (term) => (
					<div key={`${term.state}${term.class}${term.start}`}>
						{/* Horizontal Guidelines */}
						<div
							className={'timelineBlock'}
							style={{ 
								left: `${hideSpacing}px`,
								width: `${timelineLeftPosition(term)}px`,
								borderTop: '1px solid lightgrey',
								borderBottom: '1px solid lightgrey',
								top: `${hidden ? '-35px' : '0px'}`,
								zIndex: 925
							}}
						/>
						{/* Rep Term Individual */}
						<div 
							className={`timelineBlock ${politicalPartyColor(term)}`}
							style={{  
								left: `${timelineLeftPosition(term) + hideSpacing}px`,
								width: `${timelineTermWidth(term)}px`,
								top: `${hidden ? '-35px' : '0px'}`
							}}
						/>
						{/* Seat Terms Combined */}
						{!hidden &&	
							<div 
								className={`timelineBlock ${politicalPartyColor(term)}`}
								style={{  
									left: `${timelineLeftPosition(term)}px`,
									width: `${timelineTermWidth(term)}px`,
									top: `-${(index + 1) * 35}px`,
								}}
							/>
						}	
					</div>					
				))}
			</div>
		</tr>
	)
};