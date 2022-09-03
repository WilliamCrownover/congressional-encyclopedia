import { DateTimeFormatter, LocalDate, ChronoUnit } from '@js-joda/core'
import { Locale } from '@js-joda/locale_en-us'

export const calcDaysBetween = (d1, d2) => {
	const start = new LocalDate.parse(d1);
	const end = new LocalDate.parse(d2).isAfter( new LocalDate.now()) ? new LocalDate.now() : new LocalDate.parse(d2);

	return ChronoUnit.DAYS.between(start, end);
}
export const dateFormat = (date = '1000-01-01') => {
	const formatter = DateTimeFormatter.ofPattern('MMM d, yyyy').withLocale(Locale.ENGLISH);
	const formattedDate = LocalDate.parse(date).format(formatter);

	return formattedDate;
}