import { DateTime } from "luxon";

const dateNow = () => {
	const luxonDateTime = DateTime.local().setZone("Asia/Manila"); // Create a Luxon DateTime object
	// Convert Luxon DateTime to JavaScript Date
	const jsDate = luxonDateTime.toJSDate();
	return jsDate;
};

const formatDate = (dateToFormat) => {
	const singaporeDateTime = DateTime.fromJSDate(new Date(dateToFormat));
	const manilaDateTime = singaporeDateTime.setZone("Asia/Manila");
	const jsDate = manilaDateTime.toJSDate();
	return jsDate;
};

const handleFormatTime = (date) => {
	const dateNow = DateTime.fromJSDate(new Date(date)).setZone("Asia/Manila");
	const hours = dateNow.hour;
	const minutes = dateNow.minute;
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
//Date Formater
const handleformatDate = (date) => {
	const dateNow = DateTime.fromJSDate(new Date(date)).setZone("Asia/Manila");
	const month = dateNow.month;
	const day = dateNow.day;
	const year = dateNow.year;
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
	return `${months[month - 1]} ${day}, ${year}`;
};

export { handleFormatTime, handleformatDate, dateNow, formatDate };
