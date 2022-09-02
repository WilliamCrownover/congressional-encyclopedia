import { calcDaysBetween } from '../utils/timeUtils'

export const SenatorRow = ({fullName, birthday, gender, terms, wikipedia}) => {
	return (
		<tr>
			<td>{fullName}</td>
			<td>{birthday}</td>
			<td>{gender}</td>
			<td>{terms[terms.length - 1].state}</td>
			<td>{terms[terms.length - 1].party}</td>
			<td>{`${calcDaysBetween(terms[0].start, terms[terms.length - 1].end)} Days`}</td>
			<td>
				<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
			</td>
		</tr>
	)
}