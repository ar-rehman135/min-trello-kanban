import React, { useState } from "react";
import { BackgroundBlur } from "../components/BackgroundBlur";
import useKanbanBoard from "../hooks/useKanbanBoard";

const NewColumnModal = ({
  onModalClose,
}: {
  onModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [title, setTitle] = useState<string>("");
  const { createNewColumn } = useKanbanBoard();

  const validate = () => {
    if (!title.trim()) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    createNewColumn(title);
  };

  return (
    <>
      <BackgroundBlur />
      <div
        className="py-6 px-6 pb-40 absolute overflow-y-auto left-0 flex right-0 bottom-0 top-0 dropdown cursor-default"
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          onModalClose(false);
        }}
      >
        <div className="overflow-auto max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
          <h3 className="text-lg">Add New Column</h3>

          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500">
            Column Name
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="task-name-input"
              type="text"
              className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
              placeholder="e.g. Personal Tasks"
              maxLength={15}
            />
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <button
              onClick={() => {
                if (validate()) {
                  onSubmit();
                  onModalClose(false);
                }
              }}
              className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
            >
              Create Column
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewColumnModal;
