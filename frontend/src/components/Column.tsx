import { shuffle } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import { SingleColumn } from "../utils/types";

import { Draggable, Droppable } from "react-beautiful-dnd";

import Task from "./Task";
import AddTaskModal from "../modals/AddTaskModal";

import PlusIcon from "../assets/icon-plus.svg";
import BinIcon from "../assets/icon-bin.svg";
import ColumnDeleteModal from "../modals/ColumnDeleteModal";

interface ColumnProps {
  column: SingleColumn;
}

const Column: React.FC<ColumnProps> = ({ column }: ColumnProps) => {
  const colors = useMemo(
    () => [
      "bg-red-500",
      "bg-orange-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-sky-500",
    ],
    []
  );

  const [color, setColor] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>();
  const [isColumnDeleteModal, setIsColumnDeleteModal] =
    useState<boolean>(false);

  const handleAddNewModal = (state: string) => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    setColor(shuffle(colors).pop() as string);
  }, [colors]);

  return (
    <div className="overflow-auto mx-5 pt-[90px] min-w-[280px]">
      <div className="flex justify-between content-center">
        <p className="font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-white">
          <div className={`rounded-full w-4 h-4 ${color}`} />
          {column.title} ({column.cards.length})
        </p>
        <div className="flex justify-center gap-2 content-center">
          <img
            className="cursor-pointer"
            src={PlusIcon}
            alt="Add"
            width={20}
            onClick={() => handleAddNewModal(column.title)}
          />
          <img
            className="cursor-pointer"
            src={BinIcon}
            alt="Add"
            width={18}
            onClick={() => setIsColumnDeleteModal(true)}
          />
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[30px]"
          >
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task key={card.id} task={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isAddModalOpen && (
        <AddTaskModal
          columnId={column.id}
          state={column.title}
          column={column}
          setIsAddTaskModalOpen={setIsAddModalOpen}
        />
      )}
      {isColumnDeleteModal && (
        <ColumnDeleteModal
          columnTitle={column.title}
          columnId={column.id}
          onDeleteModalClose={setIsColumnDeleteModal}
        />
      )}
    </div>
  );
};

export default Column;
