import React, { Dispatch, useState } from "react";

import ElipsisMenu from "../components/ElipsisMenu";
import elipsis from "../assets/icon-vertical-ellipsis.svg";

import { Card } from "../utils/types";

import EditTaskModal from "./EditTaskModal";
import DeleteModal from "./DeleteModal";
import { BackgroundBlur } from "../components/BackgroundBlur";
import useKanbanBoard from "../hooks/useKanbanBoard";
import { convertTimestamp } from "../utils/functions";

interface TaskModalProps {
  taskData: Card;
  setIsTaskModalOpen: Dispatch<React.SetStateAction<boolean>>;
}

const TaskModal: React.FC<TaskModalProps> = ({
  taskData,
  setIsTaskModalOpen,
}) => {
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { findColumnTitleByCardId, deleteCardById } = useKanbanBoard();

  const onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setIsTaskModalOpen(false);
  };

  const onDeleteBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.textContent === "Delete") {
      deleteCardById(taskData.id);
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <BackgroundBlur />
      <div
        onClick={onClose}
        className="fixed right-0 top-0 px-2 py-4 overflow-auto z-50 left-0 bottom-0 justify-center items-center flex dropdown cursor-default"
      >
        <div className="overflow-auto max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
          <div className="relative flex justify-between w-full items-center">
            <h1 className="text-lg">{taskData?.title}</h1>
            <img
              onClick={() => setIsElipsisMenuOpen((prevState) => !prevState)}
              src={elipsis}
              alt="elipsis"
              className="cursor-pointer h-6 pr-[10px] pl-[10px]"
            />
            {isElipsisMenuOpen && (
              <ElipsisMenu
                setOpenEditModal={setOpenEditModal}
                setOpenDeleteModal={setOpenDeleteModal}
                type="Task"
              />
            )}
          </div>
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
            {taskData?.description}
          </p>
          <div className="mt-8 flex justify-between content-center">
            <p className="text-sm dark:text-white text-gray-500">
              Current Status: {findColumnTitleByCardId(taskData.id)}
            </p>
            <p className="text-sm dark:text-white text-gray-500">
              Created On: {convertTimestamp(taskData.createdAt)}
            </p>
          </div>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            onDeleteBtnClick={onDeleteBtnClick}
            type="task"
            title={taskData.title}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        )}
        {isAddTaskModalOpen && (
          <EditTaskModal
            setIsAddTaskModalOpen={setIsAddTaskModalOpen}
            setIsTaskModalOpen={setIsTaskModalOpen}
            type="edit"
            taskData={taskData}
            device="desktop"
          />
        )}
      </div>
    </>
  );
};

export default TaskModal;
