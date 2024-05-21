import { SingleColumn } from "../types";

export const getColumnIdByTitle = (
  columns: SingleColumn[],
  title: string
): string | null => {
  const column = columns.find((column) => column.title === title);
  return column ? column.id : null;
};

export const convertTimestamp = (timestamp: string): string => {
  // eslint-disable-next-line
  const [datePart, _] = timestamp.split(" ");

  const [year, month, day] = datePart.split("-");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[parseInt(month) - 1];

  const formattedDate = `${day}-${monthName}-${year}`;

  return formattedDate;
};

export const reorder = (
  list: SingleColumn[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

