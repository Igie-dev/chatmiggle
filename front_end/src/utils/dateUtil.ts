import { DateTime } from "luxon";
const dateNow = DateTime.now().setZone("Asia/Manila").toJSDate();

const getDateFrom = (date: Date) => {
  return DateTime.fromJSDate(new Date(date)).toUTC().setZone("Asia/Manila");
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const formatDate = (date: Date | null | undefined) => {
  const dateNow = getDateFrom(new Date());
  const yearNow = dateNow.year;
  if (date) {
    const dateCur = getDateFrom(date);
    const month = dateCur.month;
    const day = dateCur.day;
    const year = dateCur.year;
    return `${months[month - 1]} ${day} ${yearNow === year ? "" : year}`;
  } else {
    return "";
  }
};

const formatTime = (date: Date | null | undefined) => {
  if (!date) return "";
  const dateCur = getDateFrom(date);
  const hours = dateCur.hour;
  const minutes = dateCur.minute;
  let timeString = "";
  let meridian = "";
  if (hours === 0) {
    timeString = "12";
    meridian = "AM";
  } else if (hours > 12) {
    timeString = (hours - 12).toString();
    meridian = "PM";
  } else if (hours === 12) {
    timeString = "12";
    meridian = "PM";
  } else {
    timeString = hours.toString();
    meridian = "AM";
  }
  timeString += ":" + (minutes < 10 ? "0" + minutes : minutes);
  return timeString + " " + meridian;
};

const isToday = (date: Date): boolean => {
  const convertedDate = getDateFrom(date);
  const isToday =
    convertedDate.day === dateNow.getDate() &&
    convertedDate.year === dateNow.getFullYear() &&
    convertedDate.month === dateNow.getMonth() + 1;

  return isToday;
};

export { getDateFrom, formatDate, formatTime, dateNow, isToday };
