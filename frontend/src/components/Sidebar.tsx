import React from "react";

import boardIcon from "../assets/icon-board.svg";
import showSidebarIcon from "../assets/icon-show-sidebar.svg";
import hideSidebarIcon from "../assets/icon-hide-sidebar.svg";

interface SidebarProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSideBarOpen,
  setIsSideBarOpen,
}) => {
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `min-w-[261px] bg-kanban-bright fixed top-[0px] h-screen items-center left-0 z-20`
            : `bg-[#635FC7] dark:bg-[#2b2c37] dark:hover:bg-[#635FC7] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer p-0 transition duration-300 transform fixed flex w-[56px] h-[48px] rounded-r-full`
        }
      >
        <div>
          {/* reWrite modal  */}
          {isSideBarOpen && (
            <div className="bg-kanban-bright dark:bg-[#2b2c37] w-full py-4 mt-10 rounded-xl">
              <h3 className="dark:text-gray-300 text-white font-semibold mx-4 mb-8">
                ALL BOARDS (1)
              </h3>

              <div className="dropdown-board flex flex-col h-[70vh] justify-between">
                <div>
                  <div
                    className={`flex items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-white dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white ${
                      true && "bg-white rounded-r-full text-black mr-8"
                    }`}
                  >
                    <img
                      src={boardIcon}
                      className="filter-white h-4"
                      alt="board icon"
                    />
                    <p className="text-lg font-bold">Platform Launch</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className="flex items-center mt-2 absolute bottom-6 text-lg font-bold rounded-r-full hover:text-[#635FC7] cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#635fc71a] dark:hover:bg-white space-x-2 justify-center my-4 text-gray-500"
            >
              <img
                className="min-w-[20px]"
                src={hideSidebarIcon}
                alt="side bar show/hide"
              />
              {isSideBarOpen && <p className="text-white"> Hide Sidebar </p>}
            </div>
          ) : (
            <div
              className="w-[50px] flex justify-center align-center"
              onClick={() => toggleSidebar()}
            >
              <img
                src={showSidebarIcon}
                alt="showSidebarIcon"
                width={30}
                height={30}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
