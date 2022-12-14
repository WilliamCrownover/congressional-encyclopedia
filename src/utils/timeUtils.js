import { DateTimeFormatter, LocalDate, ChronoUnit } from '@js-joda/core'
import { Locale } from '@js-joda/locale_en-us'

export const calcDaysBetween = (d1, d2) => {
	const start = new LocalDate.parse(d1);
	const end = new LocalDate.parse(d2);
	const today = new LocalDate.now();
	const cappedEnd = end.isAfter(today) ? today : end;

	return ChronoUnit.DAYS.between(start, cappedEnd);
}

export const dateFormat = (date = '1000-01-01') => {
	const formatter = DateTimeFormatter.ofPattern('MMM d, yyyy').withLocale(Locale.ENGLISH);
	const formattedDate = LocalDate.parse(date).format(formatter);

	return formattedDate;
}

export const daysInOffice = (terms) => {
	let days = 0;

	for( let i = 0; i < terms.length; i++ ) {
		days += calcDaysBetween(terms[i].start, terms[i].end);
	}

	return days;
}