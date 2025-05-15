import { getPersianDate } from "./date";

export function getStatusInfo(status: Status, date: Date) {
  const { year, month, day } = getPersianDate(date);

  const statusStyles = {
    PENDING: "bg-yellow-500 text-yellow-900",
    REJECT: "bg-red-500 text-red-900",
    ACCEPT: "bg-green-500 text-green-900",
  };

  let statusText = "";
  switch (status) {
    case "ACCEPT":
      statusText = "تایید شد";
      break;
    case "PENDING":
      statusText = "در انتظار";
      break;
    case "REJECT":
      statusText = "رد شد";
      break;
  }

  return {
    persianDate: { day, year, month },
    statusText,
    statusStyle: statusStyles[status],
  };
}
