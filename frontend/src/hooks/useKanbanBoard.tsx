import { GraphQLResponse } from "../utils/types";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COLUMNS } from "../apollo/services/query";
import {
  getColumnIdByTitle,
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
} from "../apollo/services/mutation/update";

const useKanbanBoard = () => {
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
    async (title: string, description: string, columnId: string) => {
      const { data } = await createCard({
        variables: { title, description, columnId },
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
      const { data } = await createColumn({ variables: { title } });
      await refetch();
      return data;
    },
    [createColumn, refetch]
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
      console.log({ source, destination, draggableId, type });

      if (!destination) return;
      if (type === "COLUMN") {
        const reorderedColumns = reorder(
          fetchedColumns.allColumns,
          source.index,
          destination.index
        );
        setColumns({ allColumns: reorderedColumns });
      } else {
        if (source.droppableId !== destination.droppableId) {
          await updateCardColumn({
            variables: { id: draggableId, columnId: destination.droppableId },
          });
          await refetch();
        }
      }
    },
    [updateCardColumn, refetch]
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
