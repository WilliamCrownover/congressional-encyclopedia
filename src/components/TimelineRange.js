import { calcDaysBetween } from '../utils/timeUtils';

export const TimelineRange = ({range, cName, alignmentProps}) => {
	const { firstCongressDate, widthMultiply, timelineGridHeight, hideSpacing } = alignmentProps;
	
	return (
		<div
			className={cName}
			style={{
				left: `${calcDaysBetween(firstCongressDate, range.start)*widthMultiply + hideSpacing}px`,
				width: `${calcDaysBetween(range.start, range.end)*widthMultiply}px`,
				...timelineGridHeight
			}}
		/>
	);
}