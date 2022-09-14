import { useEffect, useState } from "react";
import { LocalDate } from '@js-joda/core'
import { TimelineRange } from '../components/TimelineRange';
import { dateFormat, daysInOffice, calcDaysBetween } from '../utils/timeUtils';
import { bioImage } from '../utils/imageUtils';
import { typicalWars, americanIndianWars, miscWars } from '../data/wars';

export const SenatorRow = ({allStates, bioguide, fullName, birthday, gender, terms, index, multipleSeats, wikipedia, numberOfReps, currentRep, hidden}) => {
	const [image, setImage] = useState();
	const firstTerm = terms[0];
	const lastTerm = terms[terms.length - 1];
	const firstCongressDate = '1789-03-04';
	const today = new LocalDate.now().toString();
	const hideSpacing = hidden ? 45 : 0;
	const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
	const widthMultiply = hidden ? windowWidth/92000 : 0.013;
	const cellWidthSmall = { width: '10px' };
	const cellWidthDate = { width: '90px' };
	const cellWidthDays = { width: '80px' };
	const cellWidthNames = { width: '230px' };
	const cellWidthParty = { width: '180px' };
	const timelineGridHeight = { height: `${hidden ? 35 : 35*(numberOfReps + 1)}px` };
	const alignmentProps = {
		firstCongressDate,
		hideSpacing,
		widthMultiply,
		timelineGridHeight
	}

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
						{[...Array(Math.ceil(calcDaysBetween(firstCongressDate, today)/365))].map( (e, i ) => (
							<div 
								className={'timelineLine'}
								style={{
									left: `${365*i*widthMultiply + hideSpacing + calcDaysBetween(firstCongressDate, '1790-01-01')*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(Math.ceil(calcDaysBetween(firstCongressDate, today)/365/2))].map( (e, i ) => (
							<div 
								className={'timelineLineTerm'}
								style={{
									left: `${365*i*widthMultiply*2 + hideSpacing + calcDaysBetween(firstCongressDate, '1791-01-01')*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(Math.ceil(calcDaysBetween(firstCongressDate, today)/365/10))].map( (e, i ) => (
							<div 
								className={'timelineLineDecade'}
								style={{
									left: `${365*i*widthMultiply*10 + hideSpacing + calcDaysBetween(firstCongressDate, '1790-01-01')*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{[...Array(Math.ceil(calcDaysBetween(firstCongressDate, today)/365/100))].map( (e, i ) => (
							<div 
								className={'timelineLineCentury'}
								style={{
									left: `${365*i*widthMultiply*100 + hideSpacing + calcDaysBetween(firstCongressDate, '1800-01-01')*widthMultiply}px`,
									...timelineGridHeight
								}}
							/>
						))}
						{miscWars.map( (war) => (
							<TimelineRange
								range={war}
								cName={'miscWarLines'}
								alignmentProps={alignmentProps}
							/>
						))}
						{americanIndianWars.map( (war) => (
							<TimelineRange
								range={war}
								cName={'americanIndianWarLines'}
								alignmentProps={alignmentProps}
							/>
						))}
						{typicalWars.map( (war) => (
							<TimelineRange
								range={war}
								cName={'typicalWarLines'}
								alignmentProps={alignmentProps}
							/>
						))}
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