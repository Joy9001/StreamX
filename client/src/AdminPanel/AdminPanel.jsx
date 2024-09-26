import { Dashboard } from "./Dashboard";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import React from "react";

function AdminPanel() {
  return (
    <>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </>
  );
}

export default AdminPanel;
