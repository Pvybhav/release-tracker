import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import TeamAndSprintManager from "./pages/TeamAndSprintManager.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import Boards from "./pages/Board/index.jsx";
import SprintView from "./pages/SprintView/index.jsx";

export const BoardContext = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Boards />,
    errorElement: <NotFound />,
  },
  {
    path: "/board/:boardName",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/:boardName/manage-team",
    element: <TeamAndSprintManager />,
    errorElement: <NotFound />,
  },
]);

function Main() {
  const [boardName, setBoardName] = useState("");

  return (
    <StrictMode>
      <BoardContext.Provider value={{ boardName, setBoardName }}>
        <RouterProvider router={router} />
        <ToastContainer />
      </BoardContext.Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
