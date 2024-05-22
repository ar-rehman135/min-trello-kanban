import React, { useCallback, useEffect, useState } from "react";
import Column from "../components/Column";
import Sidebar from "../components/Sidebar";
import useKanbanBoard from "../hooks/useKanbanBoard";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../components/StrictmodeDroppable";
import NewColumnModal from "../modals/NewColumnModal";
import { GraphQLResponse } from "../utils/types";

const Kanban = () => {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [isNewColmunModalOpen, setIsNewColmunModalOpen] =
    useState<boolean>(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);

  const { columns, onDragEnd } = useKanbanBoard(setIsUpdateInProgress);
  const [fetchedColumns, setFetchedColumns] = useState({} as GraphQLResponse);

  useEffect(() => {
    if (columns && !isUpdateInProgress) {
      setFetchedColumns(columns);
    }
  }, [columns, isUpdateInProgress]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      onDragEnd(result, setFetchedColumns, fetchedColumns);
    },
    [fetchedColumns, onDragEnd]
  );

  return (
    <div
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? "overflow-auto h-screen flex dark:bg-[#20212c] gap-6 ml-[261px]"
          : "overflow-auto h-screen flex dark:bg-[#20212c] gap-6"
      }
    >
      {windowSize[0] >= 768 && (
        <Sidebar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable
          droppableId="all-columns"
          type="COLUMN"
          direction="horizontal"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex"
            >
              {fetchedColumns?.allColumns?.map((column, index) => (
                <Draggable
                  draggableId={column.id}
                  index={index}
                  key={column.id}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Column column={column} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <div
        onClick={() => setIsNewColmunModalOpen(true)}
        className="h-[500px] dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-kanban-dark scrollbar-hide mb-2 mx-5 min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg"
      >
        <p>+ New Column</p>
      </div>
      {isNewColmunModalOpen && (
        <NewColumnModal onModalClose={setIsNewColmunModalOpen} />
      )}
    </div>
  );
};

export default Kanban;
