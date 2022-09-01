
export const SenatorCard = ({fullName, birthday, gender, wikipedia}) => {
	return (
		<div className="senatorCard">
			<h3>{fullName}</h3>
			<h4>{birthday}</h4>
			<h4>{gender}</h4>
			<a href={wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
		</div>
	)
}