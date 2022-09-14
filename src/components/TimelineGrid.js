import { TimelineYears } from './TimelineYears';
import { yearSets } from '../data/yearSets';

export const TimelineGrid = ({alignmentProps}) => {

	return (
		<>
			{yearSets.map((yearSet) => (
				<TimelineYears
					yearSet={yearSet}
					alignmentProps={alignmentProps}
				/>
			))}
		</>
	)
}