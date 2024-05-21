import React, { useState } from "react";

import TaskModal from "../modals/TaskModal";
import { Card } from "../utils/types";

interface TaskProps {
  task: Card;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        className="w-[280px] first:my-5 rounded-lg bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer"
      >
        <p className="font-bold tracking-wide">{task.title}</p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          taskData={task}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
};

export default Task;
