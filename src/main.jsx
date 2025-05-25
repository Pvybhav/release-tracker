import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import TeamAndSprintManager from "./pages/TeamAndSprintManager.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import Boards from "./pages/Board/index.jsx";
import SprintView from "./pages/SprintView/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Boards />,
    errorElement: <NotFound />,
  },
  {
    path: "/board/:boardId",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/manage-team",
    element: <TeamAndSprintManager />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </StrictMode>
);
