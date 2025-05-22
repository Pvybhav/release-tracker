import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import TeamAndSprintManager from "./pages/TeamAndSprintManager.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     path: "/manage-team",
    //     element: <TeamAndSprintManager />,
    //     errorElement: <NotFound />,
    //   },
    // ],
    errorElement: <NotFound />,
  },
  {
    path: "/manage-team",
    element: <TeamAndSprintManager />,
    // children: [
    //   {
    //     path: "/manage-team",
    //     element: <AddNewTeam />,
    //     errorElement: <NotFound />,
    //   },
    // ],
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </StrictMode>
);
