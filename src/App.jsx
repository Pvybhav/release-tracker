import "./App.css";
import { NavLink, Outlet, useParams } from "react-router";
import SprintView from "./pages/SprintView";
import { CogIcon } from "./icons/CogIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { useContext, useEffect } from "react";
import { BoardContext } from "./main";
import AppHeader from "./Components/AppHeader";

function App() {
  const boardDetails = useContext(BoardContext);
  const { boardName } = useParams();

  useEffect(() => {
    if (boardName) {
      boardDetails?.setBoardName(boardName);
    }
  }, [boardDetails, boardName]);

  return (
    <div>
      <AppHeader boardName={boardName} />
      <main className="mx-16">
        <SprintView />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
