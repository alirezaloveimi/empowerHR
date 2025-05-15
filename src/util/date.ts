import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export function getPersianDate(date: Date = new Date()) {
  const persianDate = new DateObject({
    calendar: persian,
    locale: persian_fa,
    date,
  });

  return persianDate;
}
