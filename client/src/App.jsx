import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HiredEditor from "./HiredEditor/HiredEditor.jsx";
import AdminPanel from "./AdminPanel/AdminPanel.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/HireEditor",
      element: <HiredEditor />,
    },
    {
      path: "/AdminPanel",
      element: <AdminPanel />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
