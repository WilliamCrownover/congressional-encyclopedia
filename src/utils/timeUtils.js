import { LocalDate, ChronoUnit } from '@js-joda/core'

export const calcDaysBetween = (d1, d2) => {
	const start = new LocalDate.parse(d1);
	const end = new LocalDate.parse(d2);

	return ChronoUnit.DAYS.between(start, end);
}