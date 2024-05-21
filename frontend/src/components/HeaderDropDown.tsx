import React from "react";

import boardIcon from "../assets/icon-board.svg";
import { BoardType } from "../utils/types";

interface HeaderDropDownProps {
  setOpenDropdown: (isOpen: boolean) => void;
  boards: BoardType[];
  setBoardActive: (index: number) => void;
}

const HeaderDropDown: React.FC<HeaderDropDownProps> = ({
  setOpenDropdown,
  boards,
  setBoardActive,
}) => {
  return (
    <div
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      <div className="bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl">
        <div className="dropdown-board">
          {boards.map((board, index) => (
            <div
              className={`flex items-baseline space-x-2 px-5 py-4 ${
                board.isActive
                  ? "bg-[#635fc7] rounded-r-full text-white mr-8"
                  : ""
              }`}
              key={index}
              onClick={() => setBoardActive(index)}
            >
              <img
                src={boardIcon}
                className="filter-white h-4"
                alt="board icon"
              />
              <p className="text-lg font-bold">{board.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderDropDown;
