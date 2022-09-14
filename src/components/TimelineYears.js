import { LocalDate } from '@js-joda/core';
import { calcDaysBetween } from '../utils/timeUtils';

export const TimelineYears = ({yearSet, alignmentProps}) => {
	const { spacing, cName, offsetDate } = yearSet;
	const { firstCongressDate, widthMultiply, timelineGridHeight, hideSpacing } = alignmentProps;
	const today = new LocalDate.now().toString();

	return (
		<>
			{[...Array(Math.ceil(calcDaysBetween(firstCongressDate, today)/365/spacing))].map( (e, i ) => (
				<div 
					className={cName}
					style={{
						left: `${365*i*widthMultiply*spacing + hideSpacing + calcDaysBetween(firstCongressDate, offsetDate)*widthMultiply}px`,
						...timelineGridHeight
					}}
				/>
			))}
		</>
	)
}