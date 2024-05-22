import { GraphQLResponse, SingleColumn } from "../utils/types";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COLUMNS } from "../apollo/services/query";
import {
  findHighestColumnNumber,
  getColumnIdByTitle,
  getHighestRowNumber,
  getPreviousCardInfo,
  getRowNumber,
  reorder,
} from "../utils/functions";
import { DropResult } from "react-beautiful-dnd";
import { useCallback } from "react";
import {
  CREATE_CARD_MUTATION,
  CREATE_COLUMN_MUTATION,
} from "../apollo/services/mutation/create";
import {
  DELETE_CARD_MUTATION,
  DELETE_COLUMN_MUTATION,
} from "../apollo/services/mutation/delete";
import {
  UPDATE_CARD_COLUMN_MUTATION,
  UPDATE_CARD_MUTATION,
  UPDATE_CARD_ROW_MUTATION,
} from "../apollo/services/mutation/update";

const useKanbanBoard = (
  setIsUpdateInProgress?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const {
    data: columns,
    loading: isFetchingColumns,
    error: errorFetchingColumns,
    refetch,
  } = useQuery<GraphQLResponse>(GET_ALL_COLUMNS);

  const [createCard] = useMutation(CREATE_CARD_MUTATION);
  const [deleteCard] = useMutation(DELETE_CARD_MUTATION);
  const [updateCard] = useMutation(UPDATE_CARD_MUTATION);
  const [createColumn] = useMutation(CREATE_COLUMN_MUTATION);
  const [updateCardColumn] = useMutation(UPDATE_CARD_COLUMN_MUTATION);
  const [updateCardRow] = useMutation(UPDATE_CARD_ROW_MUTATION);
  const [deleteColumn] = useMutation(DELETE_COLUMN_MUTATION);

  const findColumnTitleByCardId = useCallback(
    (cardId: string): string | null => {
      if (columns) {
        for (const column of columns.allColumns) {
          for (const card of column.cards) {
            if (card.id === cardId) {
              return column.title;
            }
          }
        }
      }
      return null;
    },
    [columns]
  );

  const createNewCard = useCallback(
    async (
      column: SingleColumn,
      title: string,
      description: string,
      columnId: string
    ) => {
      const rowNumber = getHighestRowNumber(column);
      const { data } = await createCard({
        variables: { title, description, columnId, rowNumber },
      });
      await refetch();
      return data;
    },
    [createCard, refetch]
  );

  const deleteCardById = useCallback(
    async (id: string) => {
      await deleteCard({ variables: { id } });
      await refetch();
    },
    [deleteCard, refetch]
  );

  const updateTask = useCallback(
    async (
      id: string,
      title: string,
      description: string,
      status?: string | null
    ) => {
      await updateCard({
        variables: { id, title: title || "", description: description || "" },
      });
      if (status && columns?.allColumns) {
        const columnId = getColumnIdByTitle(columns.allColumns, status);
        await updateCardColumn({ variables: { id, columnId } });
      }
      await refetch();
    },
    [updateCard, updateCardColumn, columns, refetch]
  );

  const createNewColumn = useCallback(
    async (title: string) => {
      let columnNumber;
      if (columns?.allColumns) {
        columnNumber = findHighestColumnNumber(columns?.allColumns);
      } else {
        columnNumber = 0;
      }
      const { data } = await createColumn({
        variables: { title, columnNumber },
      });
      await refetch();
      return data;
    },
    [columns?.allColumns, createColumn, refetch]
  );

  const deleteCurrentColumn = useCallback(
    async (id: string) => {
      const { data } = await deleteColumn({ variables: { id } });
      await refetch();
      return data;
    },
    [deleteColumn, refetch]
  );

  const onDragEnd = useCallback(
    async (
      result: DropResult,
      setColumns: React.Dispatch<React.SetStateAction<GraphQLResponse>>,
      fetchedColumns: GraphQLResponse
    ) => {
      const { source, destination, draggableId, type } = result;

      if (!destination) return;
      if (type === "COLUMN") {
        const reorderedColumns = reorder(
          fetchedColumns.allColumns,
          source.index,
          destination.index
        );
        setColumns({ allColumns: reorderedColumns });
      } else {
        const sourceColumnIndex = fetchedColumns.allColumns.findIndex(
          (col) => col.id === source.droppableId
        );
        const destColumnIndex = fetchedColumns.allColumns.findIndex(
          (col) => col.id === destination.droppableId
        );

        if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

        const sourceColumn = fetchedColumns.allColumns[sourceColumnIndex];
        const destColumn = fetchedColumns.allColumns[destColumnIndex];

        const sourceCards = Array.from(sourceColumn.cards);
        const destCards = Array.from(destColumn.cards);

        const [movedCard] = sourceCards.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          sourceCards.splice(destination.index, 0, movedCard);
          const newColumns = fetchedColumns.allColumns.map((col, index) => {
            if (index === sourceColumnIndex) {
              return { ...col, cards: sourceCards };
            }
            return col;
          });

          setColumns({ allColumns: newColumns });

          const prevRowNumber = getRowNumber(newColumns, draggableId);
          const { rowNumber: newRowNumber } = getPreviousCardInfo(
            newColumns,
            draggableId
          );
          if (setIsUpdateInProgress) {
            setIsUpdateInProgress(true);
            await updateCardRow({
              variables: {
                id: draggableId,
                fromRowNumber: prevRowNumber,
                toRowNumber:
                  prevRowNumber && prevRowNumber > newRowNumber
                    ? newRowNumber + 1
                    : newRowNumber,
              },
            });

            await refetch();
            setIsUpdateInProgress(false);
          }
        } else {
          destCards.splice(destination.index, 0, movedCard);
          const newColumns = fetchedColumns.allColumns.map((col, index) => {
            if (index === sourceColumnIndex) {
              return { ...col, cards: sourceCards };
            }
            if (index === destColumnIndex) {
              return { ...col, cards: destCards };
            }
            return col;
          });

          setColumns({ allColumns: newColumns });
          const prevRowNumber = getRowNumber(newColumns, draggableId);
          const { rowNumber: newRowNumber } = getPreviousCardInfo(
            newColumns,
            draggableId
          );
          if (setIsUpdateInProgress) {
            setIsUpdateInProgress(true);
            await updateCardRow({
              variables: {
                id: draggableId,
                fromRowNumber: prevRowNumber,
                toRowNumber:
                  prevRowNumber && prevRowNumber > newRowNumber
                    ? newRowNumber + 1
                    : newRowNumber,
              },
            });

            await updateCardColumn({
              variables: { id: draggableId, columnId: destination.droppableId },
            });
            await refetch();
            setIsUpdateInProgress(false);
          }
        }
      }
    },
    [refetch, setIsUpdateInProgress, updateCardColumn, updateCardRow]
  );

  return {
    columns,
    isFetchingColumns,
    errorFetchingColumns,
    deleteCardById,
    findColumnTitleByCardId,
    createNewCard,
    updateTask,
    onDragEnd,
    createNewColumn,
    deleteCurrentColumn,
  };
};

export default useKanbanBoard;
