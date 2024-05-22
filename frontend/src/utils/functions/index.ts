import { Card, SingleColumn } from "../types";

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

export function getPreviousCardInfo(
  columns: SingleColumn[],
  cardId: string
): { id: string; rowNumber: number } {
  let targetCard: Card | null = null;
  let previousCard: Card | null = null;
  let found = false;

  const allCards: Card[] = [];
  columns.forEach((column) => {
    allCards.push(...column.cards);
  });

  for (let i = 0; i < allCards.length; i++) {
    if (allCards[i].id === cardId) {
      targetCard = allCards[i];
      found = true;
      break;
    }
    previousCard = allCards[i];
  }

  if (!found) {
    throw new Error("Card with the given ID not found");
  }

  if (previousCard) {
    return { id: previousCard.id, rowNumber: previousCard.rowNumber };
  }

  const targetIndex = allCards.findIndex((card) => card.id === cardId);
  if (targetIndex >= 0 && targetIndex < allCards.length - 1) {
    const nextCard = allCards[targetIndex + 1];
    return { id: nextCard.id, rowNumber: nextCard.rowNumber - 1 };
  }

  return { id: targetCard!.id, rowNumber: targetCard!.rowNumber };
}

export const findRowId = (
  columns: SingleColumn[],
  cardIdToFind: string
): string | null => {
  for (const column of columns) {
    for (let i = 0; i < column.cards.length; i++) {
      const card = column.cards[i];
      if (card.id === cardIdToFind) {
        if (i + 1 < column.cards.length) {
          return column.cards[i + 1].id;
        } else {
          const nextColumnIndex =
            columns.findIndex((c) => c.id === column.id) + 1;
          if (nextColumnIndex < columns.length) {
            if (columns[nextColumnIndex].cards[0]) {
              return columns[nextColumnIndex].cards[0].id;
            } else {
              const totalLength = columns[nextColumnIndex - 1].cards.length - 1;
              return columns[nextColumnIndex - 1].cards[totalLength].id;
            }
          } else {
            return null;
          }
        }
      }
    }
  }
  return null;
};

export function findNextCardRow(cardId: string, singleColumns: SingleColumn[]): number | null {
  for (const column of singleColumns) {
    for (let i = 0; i < column.cards.length; i++) {
      if (column.cards[i].id === cardId) {
        // If the card is found in this column, return the row number of the next card if it exists
        if (i < column.cards.length - 1) {
          return column.cards[i + 1].rowNumber;
        } else {
          // If it's the last card in the column, check if there's another column with cards
          const nextColumnIndex = singleColumns.findIndex(c => c.id !== column.id);
          if (nextColumnIndex !== -1 && singleColumns[nextColumnIndex].cards.length > 0) {
            return singleColumns[nextColumnIndex].cards[0].rowNumber;
          }
        }
      }
    }
  }
  return null; // Return null if the card id is not found or there's no next card
}


export const getRowNumber = (
  columns: SingleColumn[],
  cardId: string
): number | null => {
  for (const column of columns) {
    const card = column.cards.find((card) => card.id === cardId);
    if (card) {
      return card.rowNumber;
    }
  }
  return null;
};

export const findHighestColumnNumber = (allColumns: SingleColumn[]): number => {
  let highestColumnNumber = 0;
  for (const column of allColumns) {
    if (column.columnNumber > highestColumnNumber) {
      highestColumnNumber = column.columnNumber;
    }
  }
  return highestColumnNumber;
};

export function getHighestRowNumber(singleColumn: SingleColumn): number | null {
  if (singleColumn.cards.length === 0) {
    return 1;
  }

  const highestRowNumber = Math.max(
    ...singleColumn.cards.map((card) => card.rowNumber)
  );

  return highestRowNumber + 1;
}
