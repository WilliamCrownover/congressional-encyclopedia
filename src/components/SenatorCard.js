
export const SenatorCard = ({fullName, birthday, gender, terms, wikipedia}) => {
	return (
		<div className="senatorCard">
			<h3>{fullName}</h3>
			<h4>{birthday}</h4>
			<h4>{gender}</h4>
			<h4>{terms[terms.length - 1].state}</h4>
			<h4>{terms[terms.length - 1].party}</h4>
			<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
		</div>
	)
}