import React, { memo } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 min-w-6xl">
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto p-6">
          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MainLayout);
