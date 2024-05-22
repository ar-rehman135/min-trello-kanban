import React, { useState } from "react";
import { BackgroundBlur } from "../components/BackgroundBlur";
import useKanbanBoard from "../hooks/useKanbanBoard";
import { SingleColumn } from "../utils/types";

interface AddTaskModalProps {
  state: string;
  device?: "mobile" | "desktop";
  columnId: string;
  column: SingleColumn;
  setIsAddTaskModalOpen: (isOpen: boolean) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  device = "desktop",
  state,
  columnId,
  column,
  setIsAddTaskModalOpen,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { createNewCard } = useKanbanBoard();

  const validate = () => {
    if (!title.trim()) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    createNewCard(column, title, description, columnId);
  };

  return (
    <>
      <BackgroundBlur />
      <div
        className={
          device === "mobile"
            ? "py-6 px-6 pb-40 absolute overflow-y-auto left-0 flex right-0 bottom-[-100vh] top-0 dropdown cursor-default"
            : "py-6 px-6 pb-40 absolute overflow-y-auto left-0 flex right-0 bottom-0 top-0 dropdown cursor-default"
        }
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          setIsAddTaskModalOpen(false);
        }}
      >
        <div className="overflow-auto max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
          <h3 className="text-lg">Add New Task</h3>

          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500">
              Task Name
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="task-name-input"
              type="text"
              className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
              placeholder="e.g. Take coffee break"
            />
          </div>

          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="task-description-input"
              className="bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
            />
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <p className="text-sm dark:text-white text-gray-500">
              Status: {state}
            </p>
            <button
              onClick={() => {
                if (validate()) {
                  onSubmit();
                  setIsAddTaskModalOpen(false);
                }
              }}
              className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
